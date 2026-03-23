let studentmodel = require("../models/admission");  // admission model use hoga
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  try {
    let token;

    // 1. Check token cookie (set by admissionlogin)
    if (req.cookies.token && req.cookies.token !== "") {
      token = req.cookies.token;
    }
    // 2. Check emtoken cookie
    else if (req.cookies.emtoken && req.cookies.emtoken !== "") {
      token = req.cookies.emtoken;
    }
    // 3. Check Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, msg: "Please login first" });
    }

    const data = jwt.verify(token, "aabb");
    console.log("Looking for email:", data.token);

    let student = await studentmodel.findOne({ email: data.token });
    console.log("Student found:", student ? student.email : null);

    if (!student) {
      return res.status(403).json({ success: false, msg: "User not found" });
    }

    req.student = student;
    next();

  } catch (err) {
    console.log("[Student Auth Error]", err.message);
    return res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
}

module.exports = auth;
