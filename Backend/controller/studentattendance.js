const { stuaddattendance, stuviewattendance, attendancecheck, viewStuAttendanceByDate } = require("../service/studentattendance");

exports.stuaddattendance=async(req,res)=>
{
 await stuaddattendance(req,res);
}

exports.stuviewattendance=async(req,res)=>
{
    await stuviewattendance(req,res);
}

exports.attendancecheck=async(req,res)=>{
    await attendancecheck(req,res);
}

exports.viewStuAttendanceByDate=async(req,res)=>{
    await viewStuAttendanceByDate(req,res);
}