let rec = require("../models/staff");
let jwt = require("jsonwebtoken");
let bct = require("bcryptjs");
let crypto=require("crypto");
const nodemailer = require("nodemailer");
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const MAIL_FROM = process.env.MAIL_FROM;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
});


exports.staffregister = async (req, res) => {
  try{
    let admin=req.admin;
    if(!admin)
    {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }
  let email = req.body.email;
  let name = req.body.name;
  let contact = req.body.contact;
  let city = req.body.city;
  let address = req.body.address;
  let image = req.file.filename;
  let department=req.body.department;
  let password = crypto.randomBytes(4).toString("hex");
  
  let hp = await bct.hash(password, 10);
  let exist = await rec.findOne({ email: email });
  if (exist) {
    return res.status(400).json({ success: false, msg: "staff already exist" });
  } else {
    let data = await rec.find();
    
    if (data.length == 0) {
      const id = 1;
      let record = new rec({
        email: email,
        password: hp,
        contact: contact,
        city: city,
        name: name,
        address: address,
        id: id,
        image: image,
        department:department,
      });
       const mail={
        from: MAIL_FROM,
        to: email,
        subject: "Welcome to EduPulse - Your Staff Account Details",
        text: `Hello ${name},\n\nWelcome to EduPulse! Your account has been created successfully. Here are your login credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease log in to your account and change your password as soon as possible.\n\nBest regards,\nEduPulse Team`
      };
      await transporter.sendMail(mail);
      await record.save();
      return res
        .status(201)
        .json({ success: true, msg: "staff registered successfully" });
    } else {
      const id = data.length + 1;
      let record = new rec({
        email: email,
        password: hp,
        contact: contact,
        city: city,
        name: name,
        address: address,
        id: id,
        image: image,
        department:department,
      });
         const mail={
        from: MAIL_FROM,
        to: email,
        subject: "Welcome to EduPulse - Your Staff Account Details",
        text: `Hello ${name},\n\nWelcome to EduPulse! Your account has been created successfully. Here are your login credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease log in to your account and change your password as soon as possible.\n\nBest regards,\nEduPulse Team`
      };
      await transporter.sendMail(mail);
      await record.save();
      return res
        .status(201)
        .json({ success: true, msg: "staff registered successfully" });
    }
  }
  }
  catch(err)
  {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

exports.stafflogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log("email",email);
  console.log("password",password);
  let data = await rec.findOne({ email: email });
  if (!data) {
    return res.status(404).json({ success: false, msg: "staff not found" });
  }
  lpass = data.password;
  pass = await bct.compare(password, lpass);
  console.log(pass);
  if (pass) {
    
    let token=jwt.sign({token:data.email},"aabb",{
      expiresIn:"1d"
    });
    res.cookie('emstoken', token);
    console.log("send token"+token);
    return res
      .status(200)
      .json({ success: true, msg: "staff login successfully",token:token});
  } else {
    return res.status(400).json({ success: false, msg: "staff login failed" });
  } 
};


exports.staffprofile = async (req, res) => {
  console.log("hi");
  let staff=req.staff;
  console.log(staff);
  return res
    .status(200)
    .json({
      success: true,
      msg: "staff profile fetched successfully",
      profile:{ email: staff.email,
        name:staff.name,
        contact: staff.contact,
        city: staff.city,
        name: staff.name,
        address: staff.address,
        id: staff.id,
        image: staff.image,
        department:staff.department,},
    });
};

exports.stafflogout = async (req, res) => {
  const staff = req.staff;
  res.clearCookie("emtoken", "");
  return { success: true };
};

exports.viewstaff = async (req, res) => {
  let stafflist = await rec.find();
  console.log(stafflist);
  if (stafflist.length === 0) {
    return res.status(404).json({ success: false, msg: "No staff found" });
  }

  return res.status(200).json({
    success: true,
    msg: "All staff details fetched successfully",
    staff: stafflist,
  });
};

exports.deletestaff = async (req, res) => {
  console.log("hello");
  let id = req.params.id;
  await rec.deleteOne({ _id: id });
  return res.status(200).json({ success: true, msg: "delete successfully!!" });
};

exports.updatestaff = async (req, res) => {
  console.log("hiiii");

  let id = req.params.id;
  let updatedData = req.body;
  let record = await rec.findByIdAndUpdate({ _id: id }, updatedData, {
    new: true,
  });

  if (!record) {
    return res
      .status(404)
      .json({ success: false, msg: "Department not found" });
  }

  console.log(record);

  return res
    .status(200)
    .json({
      success: true,
      msg: "Department updated successfully",
      staff: record,
    });
};

exports.viewbyid=async(req,res)=>
{
  try {
    const staffId = req.params.id;
    console.log("Staff ID:", staffId);
    let staff = await rec.findOne({ _id: staffId });
    if (!staff) {
      return res.status(404).json({ success: false, msg: "Staff not found" });
    }
    return res.status(200).json({
      success: true,
      msg: "Staff details fetched successfully",
      staff: staff,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}


exports.staffupdate=async(req,res)=>
{
  let staff=req.staff;
  console.log("staff",staff);
  updatedData=req.body;
  console.log("updatedData",updatedData);
  let record=await rec.findByIdAndUpdate({_id:staff._id},updatedData,{new:true});
  if(!record)  {
    return res.status(404).json({success:false,msg:"staff not found"});
  }
  return res.status(200).json({success:true,msg:"staff updated successfully",staff:record})
}