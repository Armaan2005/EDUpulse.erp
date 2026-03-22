const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meeting");

// POST /api/meeting/create - Staff only
router.post("/create", async (req, res) => {
  try {
    let code;
    let isUnique = false;
    
    // Generate unique 6-8 char code
    while (!isUnique) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existing = await Meeting.findOne({ meetingCode: code });
      if (!existing) {
        isUnique = true;
      }
    }

    const meeting = new Meeting({ meetingCode: code });
    await meeting.save();

    res.status(201).json({ meetingCode: code, roomId: code });
  } catch (error) {
    res.status(500).json({ error: "Failed to create meeting" });
  }
});

// POST /api/meeting/join - Student only
router.post("/join", async (req, res) => {
  try {
    const { meetingCode } = req.body;
    
    const meeting = await Meeting.findOne({ meetingCode });
    if (!meeting) {
      return res.status(404).json({ msg: "Meeting code invalid or expired" });
    }

    res.status(200).json({ roomId: meeting.meetingCode });
  } catch (error) {
    res.status(500).json({ error: "Error joining meeting" });
  }
});

module.exports = router;