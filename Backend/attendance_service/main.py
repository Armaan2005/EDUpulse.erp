from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil, uuid, os
from datetime import datetime, timezone
from geopy.distance import geodesic
from dotenv import load_dotenv
from pathlib import Path
from pymongo.errors import ServerSelectionTimeoutError
import traceback

_HERE = Path(__file__).resolve().parent
for _candidate in (
    _HERE / ".env",
    _HERE.parent / ".env",
    _HERE.parent.parent / ".env",
):
    if _candidate.exists():
        load_dotenv(_candidate)
        break

from database import students_collection, attendance_collection
from face_utils import get_embedding, verify_face_embedding

os.makedirs("student_images", exist_ok=True)

app = FastAPI(title="ERP Face Attendance Microservice")


@app.exception_handler(ServerSelectionTimeoutError)
async def _mongo_unavailable_handler(_: Request, __: ServerSelectionTimeoutError):
    return JSONResponse(
        status_code=503,
        content={"detail": "Attendance service unavailable (database connection failed)."},
    )


@app.exception_handler(Exception)
async def _unhandled_exception_handler(_: Request, exc: Exception):
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": f"{type(exc).__name__}: {str(exc) or 'Internal Server Error'}"},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COLLEGE_LOCATION = (27.544702911752125, 76.60339883723219)
RADIUS = 200  # meters


@app.get("/health")
async def health():
    return {"status": "ok"}



@app.post("/face/register/")
async def register_face(student_id: str, name: str, file: UploadFile = File(...)):
    """
    Register a student's face.
    - Saves image to disk
    - Extracts ArcFace embedding (with alignment + CLAHE preprocessing)
    - Stores embedding in MongoDB
    """
    file_path = f"student_images/{student_id}.jpg"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    embedding = get_embedding(file_path)

    if embedding is None:
        
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=422,
            detail="No face detected. Please use a clear, well-lit front-facing photo."
        )

    await students_collection.update_one(
        {"student_id": student_id},
        {
            "$set": {
                "student_id": student_id,
                "name": name,
                "image_path": file_path,
                "face_embedding": embedding,
                "embedding_model": "ArcFace",
                "embedding_detector": "retinaface",
                "registered_at": datetime.now(timezone.utc).isoformat(),
            }
        },
        upsert=True,
    )

    return {
        "message": f"Face registered successfully for {name}",
        "student_id": student_id,
        "model": "ArcFace",
    }



@app.post("/face/attendance/")
async def mark_attendance(student_id: str, lat: float, lon: float, file: UploadFile = File(...)):
    
    distance = geodesic((lat, lon), COLLEGE_LOCATION).meters
    if distance > RADIUS:
        raise HTTPException(
            status_code=400,
            detail=f"You are outside campus ({distance:.0f}m away, max allowed {RADIUS}m)."
        )

    
    student = await students_collection.find_one({"student_id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Face not registered. Please register your face first.")
    if "face_embedding" not in student:
        raise HTTPException(status_code=400, detail="No face embedding found. Please re-register your face.")

    
    temp_path = f"student_images/temp_{uuid.uuid4().hex}.jpg"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = verify_face_embedding(student["face_embedding"], temp_path)

        if not result["matched"]:
            raise HTTPException(
                status_code=403,
                detail=f"Face did not match (similarity: {result['similarity']}, confidence: {result['confidence']}). Attendance not marked."
            )

        
        now = datetime.now(timezone.utc)
        today_str = now.strftime("%Y-%m-%d")

        if await attendance_collection.find_one({"student_id": student_id, "date": today_str}):
            raise HTTPException(status_code=409, detail="Attendance already marked for today.")

        
        await attendance_collection.insert_one({
            "student_id": student_id,
            "student_name": student["name"],
            "lat": lat,
            "lon": lon,
            "date": today_str,
            "timestamp": now.isoformat(),
            "status": "Present",
            "similarity_score": result["similarity"],
            "confidence": result["confidence"],
            "model": "ArcFace",
        })

        return {
            "status": "Attendance marked",
            "student": student["name"],
            "time": now.strftime("%I:%M %p"),
            "date": today_str,
            "similarity": result["similarity"],
            "confidence": result["confidence"],
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)



@app.get("/face/history/")
async def get_history(student_id: str):
    student = await students_collection.find_one({"student_id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student face not registered yet.")

    cursor = attendance_collection.find(
        {"student_id": student_id}, {"_id": 0}
    ).sort("timestamp", -1).limit(30)

    records = await cursor.to_list(length=30)
    return {"student": student["name"], "total": len(records), "records": records}



@app.get("/face/admin/attendance/")
async def all_attendance(date: str = None):
    query = {"date": date} if date else {}
    cursor = attendance_collection.find(query, {"_id": 0}).sort("timestamp", -1)
    records = await cursor.to_list(length=500)
    return {"total": len(records), "records": records}



@app.delete("/face/register/")
async def delete_registration(student_id: str):
    """
    Delete a student's face registration so they can re-register.
    Useful if registration photo was low quality.
    """
    student = await students_collection.find_one({"student_id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

   
    img_path = student.get("image_path", "")
    if img_path and os.path.exists(img_path):
        os.remove(img_path)

    await students_collection.delete_one({"student_id": student_id})
    return {"message": f"Registration deleted for student {student_id}. They can now re-register."}