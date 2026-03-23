const { registerFace, markFaceAttendance, getFaceAttendanceHistory, getAllFaceAttendance }
  = require("../service/faceattendanceservice");

exports.registerFace = async (req, res) => { await registerFace(req, res); };
exports.markFaceAttendance = async (req, res) => { await markFaceAttendance(req, res); };
exports.getFaceAttendanceHistory = async (req, res) => { await getFaceAttendanceHistory(req, res); };
exports.getAllFaceAttendance = async (req, res) => { await getAllFaceAttendance(req, res); };