const { studentAIChat, staffAIChat } = require("../service/aichatservice");

exports.studentAIChat = async (req, res) => { await studentAIChat(req, res); };
exports.staffAIChat = async (req, res) => { await staffAIChat(req, res); };