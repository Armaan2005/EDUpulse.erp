let express=require("express");
const { addattendance, viewattendance, attendancecheck, viewAttendanceByDate } = require("../controller/attendancecontroller");
let auth=require("../middleware/admin")
let router=express.Router();

router.post("/addattendance",auth,addattendance);
router.get("/viewattendance",viewattendance);
router.post("/Sattendancecheck",attendancecheck);
router.get("/viewStaffAttendanceByDate", viewAttendanceByDate);  // Admin: staff attendance by date

module.exports=router;