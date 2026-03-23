let express = require("express");
let router = express.Router();
let auth = require("../middleware/student");
const multer = require("multer");

let upload = multer({ storage: multer.memoryStorage() });

const { registerFace, markFaceAttendance, getFaceAttendanceHistory, getAllFaceAttendance } 
  = require("../controller/faceattendancecontroller");

router.post("/face-attendance/register", auth, upload.single("image"), registerFace);
router.post("/face-attendance/mark", auth, upload.single("image"), markFaceAttendance);
router.get("/face-attendance/history", auth, getFaceAttendanceHistory);
router.get("/face-attendance/all", getAllFaceAttendance);

module.exports = router;