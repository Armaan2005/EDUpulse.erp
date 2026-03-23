const express = require("express");
const router = express.Router();
const studentAuth = require("../middleware/student");
const staffAuth = require("../middleware/staff");
const { studentAIChat, staffAIChat } = require("../controller/aichatcontroller");

router.post("/ai/student/chat", studentAuth, studentAIChat);
router.post("/ai/staff/chat", staffAuth, staffAIChat);

module.exports = router;