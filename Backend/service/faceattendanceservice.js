const FormData = require("form-data");
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const PYTHON_URL = process.env.PYTHON_ATTENDANCE_URL || "http://localhost:8000";

exports.registerFace = async (req, res) => {
  try {
    const student = req.adm; // admission model se aata hai
    if (!req.file) return res.status(400).json({ success: false, msg: "Please capture your face image." });

    const fd = new FormData();
    fd.append("file", req.file.buffer, { filename: "face.jpg", contentType: "image/jpeg" });
    
    // student._id aur student.name admission model se le rahe hain
    const params = new URLSearchParams({ 
      student_id: String(student._id), 
      name: student.name 
    });

    const response = await fetch(`${PYTHON_URL}/face/register/?${params}`, { 
      method: "POST", 
      body: fd, 
      headers: fd.getHeaders() 
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ success: false, msg: data.detail || "Face registration failed." });

    return res.status(200).json({ success: true, msg: "Face registered! You can now mark attendance." });
  } catch (err) {
    console.error("[RegisterFace Error]", err.message);
    return res.status(500).json({ success: false, msg: "Attendance service unavailable." });
  }
};

exports.markFaceAttendance = async (req, res) => {
  try {
    const student = req.adm; // admission model se aata hai
    if (!req.file) return res.status(400).json({ success: false, msg: "Please capture your face image." });
    
    const { lat, lon } = req.body;
    if (!lat || !lon) return res.status(400).json({ success: false, msg: "GPS location is required." });

    const fd = new FormData();
    fd.append("file", req.file.buffer, { filename: "face.jpg", contentType: "image/jpeg" });
    const params = new URLSearchParams({ 
      student_id: String(student._id), 
      lat, 
      lon 
    });

    const response = await fetch(`${PYTHON_URL}/face/attendance/?${params}`, { 
      method: "POST", 
      body: fd, 
      headers: fd.getHeaders() 
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ success: false, msg: data.detail || "Attendance failed." });

    return res.status(200).json({ success: true, msg: "Attendance marked!", date: data.date, time: data.time });
  } catch (err) {
    console.error("[MarkAttendance Error]", err.message);
    return res.status(500).json({ success: false, msg: "Attendance service unavailable." });
  }
};

exports.getFaceAttendanceHistory = async (req, res) => {
  try {
    const student = req.adm; // admission model se aata hai
    const response = await fetch(`${PYTHON_URL}/face/history/?student_id=${String(student._id)}`);
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ success: false, msg: data.detail || "Could not fetch history." });
    return res.status(200).json({ success: true, student: data.student, total: data.total, records: data.records });
  } catch (err) {
    return res.status(500).json({ success: false, msg: "Attendance service unavailable." });
  }
};

exports.getAllFaceAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const params = date ? `?date=${date}` : "";
    const response = await fetch(`${PYTHON_URL}/face/admin/attendance/${params}`);
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ success: false, msg: data.detail });
    return res.status(200).json({ success: true, total: data.total, records: data.records });
  } catch (err) {
    return res.status(500).json({ success: false, msg: "Attendance service unavailable." });
  }
};