const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  meetingCode: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Optional: auto-delete after 24 hours
  }
});

module.exports = mongoose.model("Meeting", meetingSchema);
