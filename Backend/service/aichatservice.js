const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const assignmentModel = require("../models/assignment");
const noticeModel = require("../models/notice");
const studentAttendanceModel = require("../models/studentattendance");
const admissionModel = require("../models/admission");
const submissionModel = require("../models/asssubmission");
const bookModel = require("../models/Book");
const hostelModel = require("../models/hosteldetail/studentschema");
const penaltyModel = require("../models/penalty");
const marksModel = require("../models/marks");
const quizModel = require("../models/test");

const GEMINI_API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

// ── Student Functions ──────────────────────────────────────────
const studentFunctions = {

  get_notices: async () => {
    const notices = await noticeModel.find().sort({ issueDate: -1 }).limit(10).lean();
    if (!notices.length) return "Koi notice nahi hai abhi.";
    return notices.map(n =>
      `📢 [${n.type || "General"}] ${n.title}\n   ${n.content}\n   Date: ${n.issueDate ? new Date(n.issueDate).toLocaleDateString('en-IN') : "N/A"}`
    ).join("\n\n");
  },

  get_assignments: async (student) => {
    const assignments = await assignmentModel.find().sort({ IssueDate: -1 }).lean();
    const submissions = await submissionModel.find({ studentId: String(student._id) }).lean();
    const submittedIds = submissions.map(s => String(s.assignId));
    if (!assignments.length) return "Koi assignment nahi hai.";
    return assignments.map(a =>
      `📝 ID: ${a._id}\n   Title: ${a.Title} by ${a.staffName}\n   Due: ${a.SubmissionDate ? new Date(a.SubmissionDate).toLocaleDateString('en-IN') : "N/A"}\n   Status: ${submittedIds.includes(String(a._id)) ? "✅ Submitted" : "⏳ Pending"}`
    ).join("\n\n");
  },

  get_attendance: async (student) => {
    const records = await studentAttendanceModel.find({ id: student.id }).sort({ date: -1 }).limit(30).lean();
    if (!records.length) return "Koi attendance record nahi hai.";
    const present = records.filter(r => r.status === "Full").length;
    const half = records.filter(r => r.status === "Half").length;
    const leave = records.filter(r => r.status === "Leave").length;
    const pct = ((present / records.length) * 100).toFixed(1);
    return `📊 Attendance (last ${records.length} days):\n✅ Present: ${present} | 🕐 Half: ${half} | ❌ Leave: ${leave}\n📈 Percentage: ${pct}%\n\nRecent:\n${records.slice(0, 7).map(r => `${r.date}: ${r.status}`).join("\n")}`;
  },

  get_fees: async (student) => {
    return `💰 Fee Details:\n   Base Fee: ₹${student.basefee || 0}\n   Hostel: ${student.hostel || "No"}\n   Transport: ${student.transport || "No"}\n   Library: ${student.library || "No"}\n   Total Fee: ₹${student.totalfee || 0}`;
  },

  get_library_books: async () => {
    const books = await bookModel.find().lean();
    if (!books.length) return "Library mein koi book nahi hai.";
    return `📚 Books (${books.length} total):\n` + books.slice(0, 10).map(b => `- ${b.title || b.name} by ${b.author || "N/A"}`).join("\n");
  },

  get_hostel: async (student) => {
    const h = await hostelModel.findOne({ studentId: String(student._id) }).lean();
    if (!h) return "Tumhara koi hostel registration nahi hai.";
    return `🏠 Hostel: Room ${h.roomNo || "N/A"}, Block ${h.block || "N/A"}`;
  },

  get_marks: async (student) => {
    const marks = await marksModel.findOne({ studentId: String(student._id) }).lean();
    if (!marks) return "Koi marks record nahi mila.";
    const fmt = (obj) => obj ? Object.entries(obj).filter(([k]) => k !== '_id').map(([k, v]) => `${k}:${v}`).join(", ") : "N/A";
    return `📊 Marks:\nUT1: ${fmt(marks.ut1)}\nUT2: ${fmt(marks.ut2)}\nMid Term: ${fmt(marks.midTerm)}\nFinal: ${fmt(marks.final)}`;
  },

  get_penalties: async (student) => {
    const p = await penaltyModel.find({ studentId: String(student._id) }).lean();
    if (!p.length) return "Koi penalty nahi hai. 🎉";
    return `⚠️ Penalties:\n` + p.map(x => `- ₹${x.amount} | ${x.reason} | ${x.paid ? "✅ Paid" : "❌ Unpaid"}`).join("\n");
  },

  submit_assignment: async (student, { assignmentId, note }) => {
    if (!assignmentId) return "Assignment ka ID batao. Pehle 'assignments dikhaao' bol ke ID dekho.";
    const assignment = await assignmentModel.findById(assignmentId).lean().catch(() => null);
    if (!assignment) return "Yeh assignment nahi mila. Sahi ID batao.";
    const already = await submissionModel.findOne({ assignId: assignmentId, studentId: String(student._id) });
    if (already) return `✅ "${assignment.Title}" pehle se submit ho chuka hai!`;
    await submissionModel.create({
      studentId: String(student._id),
      studentName: student.name,
      studentEmail: student.email,
      assignId: assignmentId,
      staffId: assignment.staffId,
      submissionFile: note || "Submitted via AI Assistant",
    });
    return `✅ Assignment "${assignment.Title}" successfully submit ho gaya!`;
  },
};

// ── Staff Functions ────────────────────────────────────────────
const staffFunctions = {

  get_all_students: async () => {
    const students = await admissionModel.find().lean();
    if (!students.length) return "Koi student registered nahi hai.";
    return `👥 Students (${students.length}):\n` + students.map(s =>
      `- ID: ${s._id} | ${s.name} | ${s.email} | Dept: ${s.department || "N/A"}`
    ).join("\n");
  },

  get_today_attendance: async () => {
    const today = new Date().toISOString().split("T")[0];
    const records = await studentAttendanceModel.find({ date: today }).lean();
    const students = await admissionModel.find().lean();
    const markedIds = records.map(r => r.id);
    const notMarked = students.filter(s => !markedIds.includes(s.id));
    return `📅 Today (${today}):\n✅ Present: ${records.filter(r => r.status === "Full").length}\n🕐 Half: ${records.filter(r => r.status === "Half").length}\n❌ Leave: ${records.filter(r => r.status === "Leave").length}\n⚠️ Not Marked (${notMarked.length}): ${notMarked.map(s => s.name).join(", ") || "Sab mark ho gaye"}`;
  },

  mark_student_attendance: async (staff, { studentName, studentId, date, status }) => {
    if (!status) return "Status batao: Full, Half ya Leave";
    const validStatus = ["Full", "Half", "Leave"];
    if (!validStatus.includes(status)) return "Status sirf Full, Half ya Leave ho sakta hai.";
    let student;
    if (studentId) student = await admissionModel.findById(studentId).lean().catch(() => null);
    else if (studentName) student = await admissionModel.findOne({ name: new RegExp(studentName, 'i') }).lean();
    if (!student) return "Student nahi mila. Naam ya ID sahi batao.";
    const attendDate = date || new Date().toISOString().split("T")[0];
    const existing = await studentAttendanceModel.findOne({ id: student.id, date: attendDate });
    if (existing) {
      existing.status = status;
      await existing.save();
      return `✅ ${student.name} ki attendance update ho gayi: ${status} on ${attendDate}`;
    }
    await studentAttendanceModel.create({ id: student.id, date: attendDate, status });
    return `✅ ${student.name} ki attendance mark ho gayi: ${status} on ${attendDate}`;
  },

  get_assignments: async (staff) => {
    const assignments = await assignmentModel.find({ staffId: String(staff._id) }).lean();
    const submissions = await submissionModel.find().lean();
    const students = await admissionModel.find().lean();
    if (!assignments.length) return "Tumne koi assignment nahi diya abhi tak.";
    return assignments.map(a => {
      const subs = submissions.filter(s => s.assignId === String(a._id)).length;
      return `📝 ID: ${a._id}\n   Title: ${a.Title}\n   Due: ${a.SubmissionDate ? new Date(a.SubmissionDate).toLocaleDateString('en-IN') : "N/A"}\n   Submitted: ${subs}/${students.length}`;
    }).join("\n\n");
  },

  add_assignment: async (staff, { title, description, submissionDate }) => {
    if (!title) return "Assignment ka title batao.";
    await assignmentModel.create({
      Title: title, Description: description || "",
      IssueDate: new Date(),
      SubmissionDate: submissionDate ? new Date(submissionDate) : null,
      staffId: String(staff._id), staffName: staff.name,
    });
    return `✅ Assignment "${title}" add ho gaya!`;
  },

  delete_assignment: async (staff, { assignmentId, title }) => {
    let a;
    if (assignmentId) a = await assignmentModel.findById(assignmentId).catch(() => null);
    else if (title) a = await assignmentModel.findOne({ Title: new RegExp(title, 'i'), staffId: String(staff._id) });
    if (!a) return "Assignment nahi mila.";
    await assignmentModel.findByIdAndDelete(a._id);
    return `✅ Assignment "${a.Title}" delete ho gaya.`;
  },

  get_notices: async () => {
    const notices = await noticeModel.find().sort({ issueDate: -1 }).limit(10).lean();
    if (!notices.length) return "Koi notice nahi hai.";
    return notices.map(n => `📢 ID: ${n._id}\n   [${n.type || "General"}] ${n.title}\n   ${n.content}`).join("\n\n");
  },

  add_notice: async (staff, { title, content, type, eventDate }) => {
    if (!title) return "Notice ka title batao.";
    await noticeModel.create({
      title,
      content: content || title,
      type: type || "General",
      issueDate: new Date(),
      eventDate: eventDate ? new Date(eventDate) : null,
    });
    return `✅ Notice "${title}" add ho gayi!`;
  },

  add_test: async (staff, { title, startTime, endTime, questions }) => {
    const testTitle = (title || "").trim() || `AI Test ${new Date().toISOString().slice(0, 10)}`;
    const start = startTime ? new Date(startTime) : new Date(Date.now() + 10 * 60 * 1000);
    const end = endTime ? new Date(endTime) : new Date(start.getTime() + 24 * 60 * 60 * 1000);

    const safeQuestions = Array.isArray(questions) && questions.length
      ? questions
      : [
          {
            questionText: `What is the main topic of "${testTitle}"?`,
            questionId: Date.now(),
            options: { A: "Introduction", B: "Advanced only", C: "Not related", D: "None" },
            correctAnswer: "A",
            points: 1,
          },
          {
            questionText: "Which option is generally correct in objective tests?",
            questionId: Date.now() + 1,
            options: { A: "A", B: "B", C: "C", D: "Depends on question" },
            correctAnswer: "D",
            points: 1,
          },
          {
            questionText: "Assessment submission should be done before?",
            questionId: Date.now() + 2,
            options: { A: "Start time", B: "End time", C: "Any time", D: "Never" },
            correctAnswer: "B",
            points: 1,
          },
        ];

    let quiz = await quizModel.findOne({ title: testTitle });
    if (!quiz) {
      quiz = new quizModel({ title: testTitle, startTime: start, endTime: end, questions: safeQuestions });
    } else {
      quiz.startTime = start;
      quiz.endTime = end;
      quiz.questions = [...(quiz.questions || []), ...safeQuestions];
    }
    await quiz.save();
    return `✅ Test "${testTitle}" create ho gaya. Students ko quiz list me dikhega.`;
  },

  delete_notice: async (staff, { noticeId, title }) => {
    let n;
    if (noticeId) n = await noticeModel.findByIdAndDelete(noticeId).catch(() => null);
    else if (title) n = await noticeModel.findOneAndDelete({ title: new RegExp(title, 'i') });
    if (!n) return "Notice nahi mili.";
    return `✅ Notice "${n.title}" delete ho gayi.`;
  },

  get_submissions: async (staff) => {
    const assignments = await assignmentModel.find({ staffId: String(staff._id) }).lean();
    const allSubs = await submissionModel.find().lean();
    if (!assignments.length) return "Tumhara koi assignment nahi hai.";
    return assignments.map(a => {
      const subs = allSubs.filter(s => s.assignId === String(a._id));
      return `📝 ${a.Title}:\n${subs.length ? subs.map(s => `   ✅ ${s.studentName}`).join("\n") : "   Kisi ne submit nahi kiya"}`;
    }).join("\n\n");
  },
};

// ── Gemini Caller ──────────────────────────────────────────────
async function callGemini(systemPrompt, history, userMessage, apiKey) {
  const contents = [
    ...history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    })),
    { role: "user", parts: [{ text: userMessage }] }
  ];

  const response = await fetch(`${GEMINI_API}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { maxOutputTokens: 1500, temperature: 0.7 },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("[Gemini Error]", JSON.stringify(data.error));
    throw new Error(data.error?.message || "Gemini API error");
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Koi response nahi aaya.";
}

// ── Intent Detector ────────────────────────────────────────────
async function detectIntent(message, apiKey, role) {
  const studentActions = `get_notices, get_assignments, get_attendance, get_fees, get_library_books, get_hostel, get_marks, get_penalties, submit_assignment(assignmentId,note)`;
  const staffActions = `get_all_students, get_today_attendance, mark_student_attendance(studentName,studentId,date,status), get_assignments, add_assignment(title,description,submissionDate), delete_assignment(assignmentId,title), get_notices, add_notice(title,content,type,eventDate), delete_notice(noticeId,title), get_submissions, add_test(title,startTime,endTime)`;

  const prompt = `Analyze user message and return ONLY a JSON:
{"action": "function_name or null", "params": {}}
Available actions for ${role}: ${role === 'student' ? studentActions : staffActions}
Rules:
- For attendance marking, extract student name from message
- For dates use YYYY-MM-DD format
- For status use exactly: Full, Half, or Leave
- If unclear, return null
User: "${message}"
Return ONLY valid JSON.`;

  try {
    const response = await fetch(`${GEMINI_API}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 200, temperature: 0 },
      }),
    });
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (e) {
    console.error("[Intent Error]", e.message);
    return { action: null, params: {} };
  }
}

function inferStaffIntentFallback(message) {
  const m = (message || "").toLowerCase();
  const hasCreateWord = /(add|create|make|bna|banao|banado|post|publish)/i.test(m);
  const compactTitle = (message || "").replace(/\s+/g, " ").trim().slice(0, 80);

  if (hasCreateWord && /(notice|सूचना|notis)/i.test(m)) {
    return {
      action: "add_notice",
      params: {
        title: compactTitle || "General Notice",
        content: message || "Notice posted by AI assistant",
        type: "General",
      },
    };
  }

  if (hasCreateWord && /(test|quiz|assessment)/i.test(m)) {
    return {
      action: "add_test",
      params: {
        title: compactTitle || `AI Test ${new Date().toISOString().slice(0, 10)}`,
      },
    };
  }

  return { action: null, params: {} };
}

// ── Student Chat ───────────────────────────────────────────────
exports.studentAIChat = async (req, res) => {
  try {
    const student = req.student;
    const { message, history = [] } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    console.log("[AI] Student:", student?.email);
    console.log("[AI] Gemini Key exists:", !!apiKey);
    console.log("[AI] Message:", message);

    if (!message) return res.status(400).json({ success: false, msg: "Message required" });
    if (!apiKey) return res.status(500).json({ success: false, msg: "GEMINI_API_KEY not set in .env" });

    const intent = await detectIntent(message, apiKey, 'student');
    console.log("[AI] Intent:", intent);

    let erpData = null;
    if (intent.action && studentFunctions[intent.action]) {
      erpData = await studentFunctions[intent.action](student, intent.params || {});
      console.log("[AI] ERP Data fetched for:", intent.action);
    }

    const systemPrompt = `You are EduPulse AI Assistant for student ${student.name} (Dept: ${student.department || "N/A"}).
Help students view data AND perform actions. Be friendly and concise. Reply in same language as user (Hindi/English/Hinglish).
Student: ${student.name} | Email: ${student.email} | Fee: ₹${student.totalfee || 0}
${erpData ? `\nLIVE DATA:\n${erpData}` : ""}
Present fetched data clearly. Confirm completed actions. For unknown requests, explain what you can do.`;

    const reply = await callGemini(systemPrompt, history, message, apiKey);
    return res.status(200).json({ success: true, reply });
  } catch (err) {
    console.error("[StudentAI Error]", err.message);
    return res.status(500).json({ success: false, msg: "AI error: " + err.message });
  }
};

// ── Staff Chat ─────────────────────────────────────────────────
exports.staffAIChat = async (req, res) => {
  try {
    const staff = req.staff;
    const { message, history = [] } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    console.log("[AI] Staff:", staff?.email);
    console.log("[AI] Gemini Key exists:", !!apiKey);

    if (!message) return res.status(400).json({ success: false, msg: "Message required" });
    if (!apiKey) return res.status(500).json({ success: false, msg: "GEMINI_API_KEY not set in .env" });

    const intent = await detectIntent(message, apiKey, 'staff');
    console.log("[AI] Intent:", intent);

    let resolvedIntent = intent;
    if (!resolvedIntent.action || !staffFunctions[resolvedIntent.action]) {
      resolvedIntent = inferStaffIntentFallback(message);
    }

    let erpData = null;
    if (resolvedIntent.action && staffFunctions[resolvedIntent.action]) {
      erpData = await staffFunctions[resolvedIntent.action](staff, resolvedIntent.params || {});
    }

    const systemPrompt = `You are EduPulse AI Assistant for staff ${staff.name} (Dept: ${staff.department || "N/A"}).
Help staff view data AND perform actions. Be professional and concise. Reply in same language (Hindi/English/Hinglish).
Staff: ${staff.name} | Email: ${staff.email}
${erpData ? `\nLIVE DATA:\n${erpData}` : ""}
Present fetched data clearly. Confirm completed actions. For unknown requests, explain what you can do.`;

    const reply = await callGemini(systemPrompt, history, message, apiKey);
    return res.status(200).json({ success: true, reply });
  } catch (err) {
    console.error("[StaffAI Error]", err.message);
    return res.status(500).json({ success: false, msg: "AI error: " + err.message });
  }
};