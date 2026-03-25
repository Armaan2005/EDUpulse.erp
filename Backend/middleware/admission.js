let stumodel=require("../models/admission");
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  try {
    if (req.cookies.token != undefined && req.cookies.token != "") {
      const token = req.cookies.token;
      console.log("token in auth middleware:", token);
      const data = jwt.verify(token, "aabb");
      console.log("data in auth middleware:", data);
      let adm = await stumodel.findOne({ email: data.token });
      console.log("student found in DB:", adm ? adm.email : "NOT FOUND");
      
      if (!adm) return res.status(403).json({ msg: "student not found in DB" });
      req.adm = adm;
      next();
    } else {
      return res.status(401).json({ msg: "Please Login First" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
}

module.exports = auth;
