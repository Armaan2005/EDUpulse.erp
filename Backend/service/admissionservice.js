let rec = require("../models/admission");
let rec2=require("../models/feemanagement");
let rec4 = require("../models/feeactivity");
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


exports.admission = async (req, res) => {
  try {
    let admin=req.admin;
    if(!admin)
    {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }
  console.log("req", req.body);
  let email = req.body.email;
  let name = req.body.name;
  let dob=req.body.dob;
  let contact = req.body.contact;
  let city = req.body.city;
  let address = req.body.address;
  let department=req.body.department;
  let basefee=req.body.basefee;
  let hostel=req.body.hostel;
  let library=req.body.library;
  let transport=req.body.transport;
  let totalfee=req.body.totalfee;
  let password = crypto.randomBytes(4).toString("hex");
  
  let hp = await bct.hash(password, 10);
  let exist = await rec.findOne({ email: email });
  console.log("exist",exist);
  if (exist) {
    return res.status(400).json({ success: false, msg: "student already exist" });
  } else {
      let data = await rec.find();
      if (data.length == 0) {
      const id = 1;
      let record = new rec({email: email,password: hp,contact: contact,city: city,name: name,dob:dob,address: address,id: id,department:department,basefee:basefee,hostel:hostel,library:library,transport:transport,totalfee:totalfee});
      let record2=new rec2({studentId:id,studentName:name,email:email,totalFee:totalfee,quarter1:{fees:(totalfee)/4,status:'Overdue'},quarter2:{fees:(totalfee)/4,status:'Overdue'},quarter3:{fees:(totalfee)/4,status:'Overdue'},quarter4:{fees:(totalfee)/4,status:'Overdue'},remainingFee:totalfee});
      await record2.save();
      await record.save();
      const mail={
        from: MAIL_FROM,
        to: email,
        subject: "Welcome to EduPulse - Your Student Account Details",
        text: `Hello ${name},\n\nWelcome to EduPulse! Your account has been created successfully. Here are your login credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease log in to your account and change your password as soon as possible.\n\nBest regards,\nEduPulse Team`
      };
      await transporter.sendMail(mail);
      return res.status(201).json({ success: true, msg: "student registered successfully" });
    } 
    else {  
    
      const id = data.length + 1; 
      let record = new rec({email: email,password: hp,contact: contact,city: city,name: name,id:id,dob:dob,address: address,department:department,basefee:basefee,hostel:hostel,library:library,transport:transport,totalfee:totalfee});
      let record2=new rec2({studentId:id,studentName:name,email:email,totalFee:totalfee,quarter1:{fees:(totalfee)/4,status:'Overdue'},quarter2:{fees:(totalfee)/4,status:'Overdue'},quarter3:{fees:(totalfee)/4,status:'Overdue'},quarter4:{fees:(totalfee)/4,status:'Overdue'},remainingFee:totalfee});
      await record2.save();
      await record.save();

       const mail={
        from: MAIL_FROM,
        to: email,
        subject: "Welcome to EduPulse - Your Student Account Details",
        text: `Hello ${name},\n\nWelcome to EduPulse! Your account has been created successfully. Here are your login credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease log in to your account and change your password as soon as possible.\n\nBest regards,\nEduPulse Team`

      };
      await transporter.sendMail(mail);
      return res.status(200).json({ success: true, msg: "student registered successfully" });
    }
  }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }

};


exports.admissionlogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log("login req", req.body);
    let data = await rec.findOne({ email: email });
    console.log("data", data);
  if (!data) {
    return res.status(404).json({ success: false, msg: "student not found" });
  }
    lpass = data.password;
    pass = await bct.compare(password, lpass);
    if (pass) {
    let token = jwt.sign({ token: data.email }, "aabb", {
      expiresIn: "1d",
    });
    res.cookie("token", token);
    console.log("send token" + token);
    return res.status(200).json({ success: true, msg: "student login successfully",token});
  } else {
    return res.status(400).json({ success: false, msg: "student login failed" });
  }
};


exports.studentprofile = async (req, res) => {
  console.log("req.adm",req.adm);
  let adm=req.adm;
  console.log("adm",adm);
  return res
    .status(200)
    .json({
      success: true,
      msg: "student profile fetched successfully",
      student: {
        email: adm.email,
        name: adm.name,
        contact: adm.contact,
        address: adm.address,
        id: adm.id,
        city: adm.city,
        dob: adm.dob,
        department:adm.department,
        basefee:adm.basefee,
        totalfee:adm.totalfee,
remainingFee:adm.remainingFee,
      },
    });
};


exports.studentDashboard = async (req, res) => {
  const student=req.adm;
  return res.status(200).json({
    success: true,
    msg: "student dashboard data fetched successfully",
    dashboard: {
      name: student.name,
      email: student.email,
      contact: student.contact,
      city: student.city,
      department: student.department,
    },
  });
}

exports.viewstudent = async (req, res) => {
  
  let studentlist = await rec.find();
 
  if (studentlist.length === 0) {
    return res.status(404).json({ success: false, msg: "No student found" });
  }
  return res.status(200).json({
    success: true,
    msg: "All student details fetched successfully",
    student: studentlist,
  });
};


exports.payfee = async (req, res) => {
  const quarter = req.body.quarter; 
  console.log("quarter",quarter);
  const studentId = req.adm.id;    
  console.log("studentId",studentId);
  const totalFee = req.adm.totalfee;
  console.log("totalFee",totalFee);
  const amount = totalFee / 4;     

  try {
    let feeRecord = await rec2.findOne({ studentId: studentId });

    if (!feeRecord) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }
    const selectedquarter = feeRecord[quarter];
    selectedquarter.status = 'Paid';
    selectedquarter.fees = amount;
    feeRecord.remainingFee -= amount;
    await feeRecord.save();

    let feeActivity = new rec4({
      studentId: feeRecord.studentId,
      studentName: feeRecord.studentName,
      quarter: quarter,
      amount: amount,
    });

    await feeActivity.save();

    return res.status(200).json({
      success: true,
      msg: `Fee } paid successfully`,
      remainingFee: feeRecord.remainingFee, 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};


exports.studentprofile2 = async (req, res) => {
  console.log("req.adm",req.adm);
  console.log("6")
  let adm=req.adm;
  console.log("adm",adm);
  data=await rec2.findOne({studentId:adm.id});
  console.log("data",data);
  return res
    .status(200)
    .json({
      success: true,
      msg: "student profile fetched successfully",
      student: data,
    });
};

exports.viewbyidstudent=async(req,res)=>
{
  console.log("id",req.params.id);
  try {
    const studentId = req.params.id;
    console.log("Student ID:", studentId);
    let student = await rec.findOne({ _id: studentId });
    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }
    return res.status(200).json({
      success: true,
      msg: "Student details fetched successfully",
      student: student,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}

exports.updatestudentpersonal=async(req,  res)=>
{
  try {
    const studentid=req.adm._id;
    const updatedData = req.body;
    console.log("Student ID:", studentid);
    console.log("Updated Data:", updatedData);
    let student = await rec.findByIdAndUpdate({ _id: studentid }, updatedData, { new: true });
    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }
    return res.status(200).json({
      success: true,
      msg: "Student details updated successfully",
      student: {
        email: student.email,
        name: student.name,
        contact: student.contact,
        address: student.address,
        id: student.id,
        city: student.city,
        dob: student.dob,
        password: student.password,
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}

exports.deletestudent=async(req,res)=>
{
  try {
    const studentId = req.params.id;
    console.log("Student ID to delete:", studentId);
    let student = await rec.findByIdAndDelete({ _id: studentId });
    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }
    await rec2.findOneAndDelete({ studentId: student.id });
    return res.status(200).json({
      success: true,
      msg: "Student deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}

exports.updatestudent=async(req,res)=>
{
  try {
    const studentId = req.params.id;
    const updatedData = req.body;
    console.log("Student ID:", studentId);
    console.log("Updated Data:", updatedData);
    let student = await rec.findByIdAndUpdate({ _id: studentId }, updatedData, { new: true });  
    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }
    return res.status(200).json({
      success: true,
      msg: "Student details updated successfully",
      student: student,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}

exports.updatestudentpersonal=async(req,res)=>
{
  try {
    const studentId = req.adm._id;
    const updatedData = req.body;
    console.log("Student ID:", studentId);
    console.log("Updated Data:", updatedData);
    let student = await rec.findByIdAndUpdate({ _id: studentId }, updatedData, { new: true });  
    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }
    return res.status(200).json({
      success: true,
      msg: "Student details updated successfully",
      student: {
        email: student.email,
        name: student.name,
        contact: student.contact,
        address: student.address,
        id: student.id,
        city: student.city,
        dob: student.dob
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }

}