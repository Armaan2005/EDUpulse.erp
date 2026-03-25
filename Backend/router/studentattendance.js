let express=require("express");
const { stuaddattendance, stuviewattendance, attendancecheck, viewStuAttendanceByDate } = require("../controller/studentattendance");
let auth=require("../middleware/admin")

let router=express.Router();

router.post("/stuaddattendance",auth,stuaddattendance);
router.get("/stuviewattendance",stuviewattendance);
router.post("/attendancecheck",attendancecheck);
router.get("/viewStuAttendanceByDate", viewStuAttendanceByDate);  // Teacher/Admin: student attendance by date

module.exports=router;