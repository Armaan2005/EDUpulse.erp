  let adminmodel=require("../models/admin");
const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
  try {
    let token;
    
    // Check for token in cookies first
    if (req.cookies.emtoken != undefined && req.cookies.emtoken != "") {
      token = req.cookies.emtoken;
    } 
    // Check for token in Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      const data = jwt.verify(token, "aabb");
      let admin = await adminmodel.findOne({ email: data.token });
      
      if (!admin) return res.status(403).json({ msg: "admin not found" });
      else{
      req.admin = admin;
      next();
      }
    } else {
      console.log("Please Login First");
      return res.status(401).json({ msg: "Authentication required" });
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
