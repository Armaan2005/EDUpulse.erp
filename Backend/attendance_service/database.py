from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

client = AsyncIOMotorClient(
    MONGO_URL,
    serverSelectionTimeoutMS=3000,
    connectTimeoutMS=3000,
)
db = client["attendance_db"]

students_collection = db["face_students"]
attendance_collection = db["face_attendance"]