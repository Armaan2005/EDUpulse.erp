let rec=require('../models/transport/driver');
let rec2=require('../models/transport/studenttransport');
let rec3=require('../models/transport/transportCondition');
let rec4=require('../models/transport/BusRoute');

exports.conditionupdate=async(req,res)=>
{
let admin=req.admin;
if(!admin)
{
  return res.status(401).json({success:false,msg:"Unauthorized"});
}
let busNo=req.body.busNo;
let size=req.body.size;
let fuelCapacity=req.body.fuelCapacity;
let currentFuel=req.body.currentFuel;
let routeNo=req.body.routeNo;
let busType=req.body.busType;
let mileage=req.body.mileage;
let lastRefuelDate=req.body.lastRefuelDate;
let lastMaintenanceDate=req.body.lastMaintenanceDate;
let status=req.body.status;

exist=await rec3.findOne({busNo:busNo});
if(exist)
{
  return res.status(400).json({success:false,msg:"Condition for this bus already exists"});
}
let newcondition=new rec3({busNo:busNo,size:size,fuelCapacity:fuelCapacity,currentFuel:currentFuel,routeNo:routeNo,busType:busType,mileage:mileage,lastRefuelDate:lastRefuelDate,lastMaintenanceDate:lastMaintenanceDate,status:status});
await newcondition.save();
return res.status(201).json({success:true,msg:"condition updated"});
}

exports.updatecondition=async(req,res)=>
{
let admin=req.admin;
if(!admin)
{
  return res.status(401).json({success:false,msg:"Unauthorized"});
}
let id=req.params.id;
let updateData=req.body;

let condition=await rec3.findByIdAndUpdate(id, updateData, {new:true});
if(!condition)
{
  return res.status(404).json({success:false,msg:"Condition not found"});
}
return res.status(200).json({success:true,msg:"Condition updated successfully", data:condition});
}

exports.viewtransportconditions=async(req,res)=>
{
  let admin=req.admin;
  if(!admin)
  {
    return res.status(401).json({success:false,msg:"Unauthorized"});
  }
  let conditions=await rec3.find();
  return res.status(200).json({success:true,data:conditions});

}

exports.driverdetails=async(req,res)=>
{
  let admin=req.admin;
  if(!admin)
  {
    return res.status(401).json({success:false,msg:"Unauthorized"});
  }
  let Route=req.body.Route;
  let name=req.body.name;
  let licenseNumber=req.body.licenseNumber;
  let phoneNumber=req.body.phoneNumber;
  let email=req.body.email;
  let dateOfBirth=req.body.dateOfBirth;
  let address=req.body.address;
  let employmentStartDate=req.body.employmentStartDate;
  
  let route=await rec.findOne({Route:Route});
  if(route)
  {
    return res.status(400).json({success:false,msg:"Route already assigned to another driver"});
  }
  let data=await rec.find();
  if(data.length==0){
    driverId=1;
  let newdriver=new rec({driverId:driverId,Route:Route,name:name,licenseNumber:licenseNumber,phoneNumber:phoneNumber,email:email,dateOfBirth:dateOfBirth,address:address,employmentStartDate:employmentStartDate});
  await newdriver.save();
  return res.status(201).json({success:true,msg:"driver details added"});
  }
  else{
    driverId=data.length+1;
  let newdriver=new rec({driverId:driverId,Route:Route,name:name,licenseNumber:licenseNumber,phoneNumber:phoneNumber,email:email,dateOfBirth:dateOfBirth,address:address,employmentStartDate:employmentStartDate});
  await newdriver.save();
  return res.status(201).json({success:true,msg:"driver details added"});
   }
}

exports.viewdrivers=async(req,res)=>
{
  let admin=req.admin;
  if(!admin)
  {
    return res.status(401).json({success:false,msg:"Unauthorized"});
  }
  let driver=await rec.find();
  return res.status(200).json({success:true,driver:driver});
}

exports.studenttransportdetails=async(req,res)=>
{
  console.log(req.body);
  let studentId=req.adm;
  let Route=req.body.route;
  let Stop=req.body.stop;
  let arrivalTime=req.body.arrivalTime;
  let departureTime=req.body.departureTime;
  existingStudent=await rec2.findOne({studentId:studentId.id});
  if(existingStudent)
  {
    return res.status(400).json({success:false,msg:'Student transport details already exists'});
  }
  let record=new rec2({studentId:studentId.id,studentName:studentId.name,address:studentId.address,contactNumber:studentId.contact,Route:Route,Stop:Stop,arrivalTime:arrivalTime,departureTime:departureTime});
  await record.save();
  return res.status(201).json({success:true,msg:"student detail added"});
}

exports.viewstudenttransport=async(req,res)=>
{
  let studentId=req.adm;
  let studenttransport=await rec2.findOne({studentId:studentId.id});
  return res.status(200).json({success:true,studenttransport:studenttransport});
}
exports.viewallstudenttransport=async(req,res)=>
{
  let admin=req.admin;
  if(!admin)
  {
    return res.status(401).json({success:false,msg:"Unauthorized"});
  }
  let stu=await rec2.find();
  return res.status(200).json({success:true,stu:stu});
}

exports.addroute=async(req,res)=>
{
  let admin=req.admin;
  if(!admin)
  {
    return res.status(401).json({success:false,msg:"Unauthorized"});
  }
  existingRoute=await rec4.findOne({routeNumber:req.body.routeNumber});
  if(existingRoute)
  {
    return res.status(400).json({success:false,msg:"Route number already exists"});
  }
  let routeNumber=req.body.routeNumber;
  let startTime=req.body.startTime;
  let endTime=req.body.endTime;
  let stops=req.body.stops;

  let newroute=new rec4({routeNumber:routeNumber,startTime:startTime,endTime:endTime,stops:stops});
  await newroute.save();
  return res.status(201).json({success:true,msg:"route added"});
}

exports.viewroutes=async(req,res)=>
{
  let admin=req.admin;
  if(!admin)
  {
    return res.status(401).json({success:false,msg:"Unauthorized"});
  }
  let routes=await rec4.find();
  return res.status(200).json({success:true,routes:routes});
}

exports.viewroutes2=async(req,res)=>
{
  let student=req.adm;
  if(!student)
  {
    return res.status(401).json({success:false,msg:"Unauthorized"});
  }
  let routes=await rec4.find();
  return res.status(200).json({success:true,routes:routes});
}


exports.viewroutebyid=async(req,res)=>
{
  let routeNumber=req.params.id;
  let route=await rec4.findOne({routeNumber:routeNumber});
  return res.status(200).json({success:true,stops:route});
}