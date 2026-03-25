let rec=require('../models/hosteldetail/room');
let rec2=require('../models/hosteldetail/studentschema');
let rec3=require('../models/hosteldetail/fees');
let rec4=require('../models/admission');
const nodemailer = require('nodemailer');
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

exports.addroom=async(req,res)=>
{
    let singleRooms=req.body.singleRooms;
    let doubleRooms=req.body.doubleRooms;
    let data=new rec({singleRooms:singleRooms,doubleRooms:doubleRooms});
    await data.save();
    return res.status(200).json({success:true,msg:'room added successfully'});

}

exports.viewroom=async(req,res)=>
{
    let roomlist=await rec.find();
    console.log(roomlist);
    return res.status(200).json({success:true,msg:'all room details fetched successfully',
        room:roomlist
    });
}

exports.updateroom=async(req,res)=>
{
    console.log('hiiii');
    let id=req.params.id;
    let updatedData=req.body;
    let record=await rec.findByIdAndUpdate({_id:id},updatedData,{new:true});

    if(!record)
    {
        return res.status(404).json({success:false,msg:"Room details not found"});
    }   
    console.log(record);

    return res.status(200).json({success:true,msg:"Room details updated successfully",
        room:record
    });
};




exports.studentregister = async (req, res) => {
  try {
  let studentId=req.adm;
  console.log(studentId.name);
  let bloodGroup=req.body.bloodGroup;
  let allergies=req.body.allergies;
  let emergencyContact=req.body.emergencyContact;
  let gender=req.body.gender;
  let roomType=req.body.roomType;
  let ac=req.body.ac;
  let cooler=req.body.cooler;
  let fan=req.body.fan;
  let personalKitchen=req.body.personalKitchen;
  let attachedBathroom=req.body.attachedBathroom;
  let balcony=req.body.balcony;
  let laundry=req.body.laundry;
  let wifi=req.body.wifi;
  let gym=req.body.gym;
  let totalCharge=req.body.totalCharge;
  let roomNo;
  existingStudent=await rec2.findOne({studentid:studentId.id});
  if(existingStudent)
  {
    return res.status(400).json({success:false,msg:'Student already registered for hostel'});
  }
  
    if (roomType === 'single') {
      const singleStudents = await rec2.find({ roomType: 'single' });
      if (singleStudents.length === 0) {
        roomNo = 101;
      } else {
        roomNo = 101 + singleStudents.length;
      }

    } else if (roomType === 'double') {
      const doubleStudents = await rec2.find({ roomType: 'double' });

      if (doubleStudents.length === 0) {
        roomNo = 201;
      } else {
        if (doubleStudents.length % 2 === 0) {
          roomNo = 201 + (doubleStudents.length / 2);
        } else {
          roomNo = 201 + Math.floor(doubleStudents.length / 2);
        }
      }

    } 
    let feeRecord = new rec3({
    StudentId: studentId.id,
    StudentName: studentId.name,
    totalAmount: totalCharge,
    paymentStatus: 'unpaid', 
    amountPaid: 0 
  });

  await feeRecord.save();


  let data=new rec2({studentid:studentId.id,Name:studentId.name,address:studentId.address,contactNumber:studentId.contact,email:studentId.email,dob:studentId.dob,bloodGroup:bloodGroup,allergies:allergies,emergencyContact:emergencyContact,gender:gender,roomType:roomType,ac:ac,cooler:cooler,fan:fan,personalKitchen:personalKitchen,attachedBathroom:attachedBathroom,balcony:balcony,laundry:laundry,wifi:wifi,gym:gym,totalCharge:totalCharge,roomNo:roomNo});
  await data.save();
  return res.status(201).json({success:true,msg:'student hostel added successfully',data:data});
  } catch (error) {
    console.error("Hostel Registration Error:", error);
    return res.status(500).json({ success: false, msg: `Internal Server Error: ${error.message}` });
  }

};


exports.feespayment = async (req, res) => {
    try {
        const studentId = req.adm;
        
        const { paymentStatus, amountPaid } = req.body; 
        let feeRecord = await rec3.findOne({ StudentId: studentId.id });
        
        feeRecord.paymentStatus = paymentStatus;
        feeRecord.amountPaid = amountPaid; 
        feeRecord.date = new Date(); 
        await feeRecord.save();

        return res.status(200).json({
            success: true,
            msg: `Fee record updated successfully for Student ID ${studentId.id}`,
            data: feeRecord
        });

    } catch (error) {
        console.error("Fee Update Error:", error);
        return res.status(500).json({ success: false, msg: `Internal Server Error: ${error.message}` });
    }
};



exports.viewstudenthostel=async(req,res)=>
{
  let studentId=req.adm;
  let student=await rec2.findOne({studentid:studentId.id});
  return res.status(200).json({success:true,student:student});
}

exports.viewfees=async(req,res)=>
{
  let studentId=req.adm;
  let feeDetails=await rec3.findOne({StudentId:studentId.id});
  return res.status(200).json({success:true,feeDetails:feeDetails});
}

exports.studenthostelview=async(req,res)=>
{
  let admin=req.admin;
  if(!admin)
  {
    return res.status(403).json({success:false,msg:'Access denied. Admin privileges required.'});
  }
  let student=await rec2.find();
  let feeDetails=await rec3.find();
  return res.status(200).json({success:true,student:student,feeDetails:feeDetails});
}

exports.sendfeesreminder = async (req, res) => 
{

  try {
    const {email, amount} = req.body;
     console.log("Email:", email);
    console.log("Amount:", amount);
    const mail={
      from: MAIL_FROM,
      to: email,
      subject: "Hostel Fee Payment Reminder",
      text: `Dear Student, this is a reminder that your hostel fee payment of ₹${amount} is pending. Please make the payment at your earliest convenience to avoid any late fees or else your services may be affected. Thank you!
      team EduPulse.`

    }

    await transporter.sendMail(mail);

    return res.status(200).json({ success: true, msg: "Fee reminder sent successfully." });
  } catch (error) {
    console.error("Error sending fee reminder:", error);
    return res.status(500).json({ success: false, msg: "Failed to send fee reminder." });
  }
}