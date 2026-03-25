let rec=require("../models/studentattendance");
let Student=require("../models/admission");
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));
const PYTHON_URL = process.env.PYTHON_ATTENDANCE_URL || "http://localhost:8000";

exports.stuaddattendance=async(req,res)=>
{
       let id=req.body.id;
       let date=req.body.date;
       let status=req.body.status;
console.log("req body--",req.body);

      let data=await rec.findOne({id,date})
      if(data)
      {
        return res.status(404).json({success:false,msg:"this already exist"});
      }
      else{
      let record=new rec({id:id,date:date,status:status});
      await record.save();
      return res.status(201).json({success:true,msg:"attendance got marked"});
      }
}

exports.stuviewattendance = async (req, res) => {
  let attendancelist = await rec.find();
  if (attendancelist.length === 0) {
    return res.status(404).json({ success: false, msg: "No student found" });
  }
  return res.status(200).json({
    success: true,
    msg: "All student attendance fetched successfully",
    attendance: attendancelist,
  });
};

exports.attendancecheck=async(req,res)=>
  {
    const records = req.body.records;
  try {
    const results = [];
    for (let record of records) {
      const existing = await rec.findOne({ date: record.date, id: record.id });
      if (!existing) {
        const attendanceRecord = new rec({ id: record.id, status: record.status, date: record.date });
        await attendanceRecord.save();
      }
    }
    return res.status(200).json({ message: "Attendance records saved successfully", data: results });
  } catch (error) {
    return res.status(500).json({ message: "Error saving attendance records", error });
  }
};

// Teacher/Admin: View all students' attendance for a specific date
exports.viewStuAttendanceByDate = async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ success: false, msg: "Date is required (YYYY-MM-DD)" });
  }
  try {
    const attendanceRecords = await rec.find({ date });
    const allStudents = await Student.find();

    // Also pull face-attendance entries from Python service for same date.
    let faceByStudentObjectId = new Set();
    try {
      const response = await fetch(`${PYTHON_URL}/face/admin/attendance/?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        const faceRecords = Array.isArray(data.records) ? data.records : [];
        faceByStudentObjectId = new Set(
          faceRecords
            .map((r) => String(r.student_id || ""))
            .filter(Boolean)
        );
      }
    } catch (_) {
      // Keep manual attendance view working even if Python service is unavailable.
    }

    const result = allStudents.map((student) => {
      const att = attendanceRecords.find((r) => Number(r.id) === Number(student.id));
      const markedByFace = faceByStudentObjectId.has(String(student._id));
      return {
        id: student.id,
        name: student.name,
        status: att ? att.status : (markedByFace ? "Full" : "Leave"),
        marked: !!att || markedByFace,
      };
    });

    const presentCount = result.filter((r) => r.status === "Full").length;
    const halfCount    = result.filter((r) => r.status === "Half").length;
    const leaveCount   = result.filter((r) => r.status === "Leave").length;

    return res.status(200).json({
      success: true,
      date,
      summary: { present: presentCount, half: halfCount, leave: leaveCount, total: allStudents.length },
      attendance: result,
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};