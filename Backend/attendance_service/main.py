from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil, uuid, os
from datetime import datetime, timezone
from geopy.distance import geodesic

from database import students_collection, attendance_collection
from face_utils import get_embedding, verify_face_embedding

os.makedirs("student_images", exist_ok=True)

app = FastAPI(title="ERP Face Attendance Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COLLEGE_LOCATION = (27.631249, 76.656451)  # ← apna college ka lat/lon daalo
RADIUS = 200  # meters

@app.post("/face/register/")
async def register_face(student_id: str, name: str, file: UploadFile = File(...)):
    file_path = f"student_images/{student_id}.jpg"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    embedding = get_embedding(file_path)
    if embedding is None:
        os.remove(file_path)
        raise HTTPException(status_code=422, detail="No face detected. Use clear lighting.")

    await students_collection.update_one(
        {"student_id": student_id},
        {"$set": {"student_id": student_id, "name": name, "image_path": file_path,
                  "face_embedding": embedding, "embedding_model": "VGG-Face",
                  "registered_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True
    )
    return {"message": f"Face registered successfully for {name}"}


@app.post("/face/attendance/")
async def mark_attendance(student_id: str, lat: float, lon: float, file: UploadFile = File(...)):
    distance = geodesic((lat, lon), COLLEGE_LOCATION).meters
    if distance > RADIUS:
        raise HTTPException(status_code=400, detail=f"Outside campus ({distance:.0f}m away, max {RADIUS}m).")

    student = await students_collection.find_one({"student_id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Face not registered. Register your face first.")
    if "face_embedding" not in student:
        raise HTTPException(status_code=400, detail="No face embedding. Re-register your face.")

    temp_path = f"student_images/temp_{uuid.uuid4().hex}.jpg"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        if not verify_face_embedding(student["face_embedding"], temp_path):
            raise HTTPException(status_code=403, detail="Face did not match. Attendance not marked.")

        now = datetime.now(timezone.utc)
        today_str = now.strftime("%Y-%m-%d")

        if await attendance_collection.find_one({"student_id": student_id, "date": today_str}):
            raise HTTPException(status_code=409, detail="Attendance already marked for today.")

        await attendance_collection.insert_one({
            "student_id": student_id, "student_name": student["name"],
            "lat": lat, "lon": lon, "date": today_str,
            "timestamp": now.isoformat(), "status": "Present"
        })
        return {"status": "Attendance marked", "time": now.strftime("%I:%M %p"), "date": today_str}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.get("/face/history/")
async def get_history(student_id: str):
    student = await students_collection.find_one({"student_id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student face not registered yet.")
    cursor = attendance_collection.find({"student_id": student_id}, {"_id": 0}).sort("timestamp", -1).limit(30)
    records = await cursor.to_list(length=30)
    return {"student": student["name"], "total": len(records), "records": records}


@app.get("/face/admin/attendance/")
async def all_attendance(date: str = None):
    query = {"date": date} if date else {}
    cursor = attendance_collection.find(query, {"_id": 0}).sort("timestamp", -1)
    records = await cursor.to_list(length=500)
    return {"total": len(records), "records": records}