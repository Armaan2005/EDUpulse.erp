let rec2=require("../models/marks");
let rec=require("../models/subjects");

exports.subjectregister=async(req,res)=>
{
  let admin=req.admin;
  if(!admin){
    return res.status(401).json({success:false,msg:"Unauthorized"});
   }
console.log("req",req.body);
      let branch=req.body.departmentId;
      let subject1=req.body.subject1;
      let subject2=req.body.subject2;
      let subject3=req.body.subject3;
      let subject4=req.body.subject4;
      let subject5=req.body.subject5;
      let subject6=req.body.subject6;
     let data=await rec.find();
     if(data.length==0){
     let record=new rec({branch:branch,subject1:subject1,subject2:subject2,subject3:subject3,subject4:subject4,subject5:subject5,subject6:subject6});
     console.log(record);
     await record.save();
     return res.status(200).json({success: true,msg:'subject registered successfully'}) 
     }
     else{
        let record=new rec({branch:branch,subject1:subject1,subject2:subject2,subject3:subject3,subject4:subject4,subject5:subject5,subject6:subject6});
        await record.save();
        return res.status(200).json({success: true,msg:'subject registered successfully'}) 
     }
}

exports.viewsubjects=async(req,res)=>
{

    console.log("req.adm",req.adm);
    let data=await rec.find();
    console.log("data",data);
    return res.status(200).json({success:true,msg:"subjects fetched successfully",subject:data});
}

exports.unittest1 = async (req,res) => {
    try{
      console.log("req body",req.body);
    let studentId=req.body.studentId;
    let subject1=req.body.subject1;
    let subject2=req.body.subject2;
    let subject3=req.body.subject3;
    let subject4=req.body.subject4;
    let subject5=req.body.subject5;
    let subject6=req.body.subject6;

    let marks = await rec2.findOne({studentId:studentId});
    if (!marks) {
      marks = new rec2({studentId: studentId});
    }
    marks.ut1.subject1 = subject1 ;
    marks.ut1.subject2 = subject2 ;
    marks.ut1.subject3 = subject3 ;
    marks.ut1.subject4 = subject4 ;
    marks.ut1.subject5 = subject5 ;
    marks.ut1.subject6 = subject6 ;

   await marks.save();

    res.status(200).json({
      success: true,
      message: 'UT1 marks saved successfully',
    
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'UT1 subject entry failed', error: error.message });
  }
};



exports.midTerm = async (req,res) => {
    try{
    let studentId=req.body.studentId;
    let subject1=req.body.subject1;
    let subject2=req.body.subject2;
    let subject3=req.body.subject3;
    let subject4=req.body.subject4;
    let subject5=req.body.subject5;
    let subject6=req.body.subject6;
    let marks = await rec2.findOne({studentId:studentId});

    marks.midTerm.subject1 = subject1 ;
    marks.midTerm.subject2 = subject2 ;
    marks.midTerm.subject3 = subject3 ;
    marks.midTerm.subject4 = subject4 ;
    marks.midTerm.subject5 = subject5 ;
    marks.midTerm.subject6 = subject6 ;

    await marks.save();

    
    res.status(200).json({
      success: true,
      message: 'Mid Term marks saved successfully',
    
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Mid Term subject entry failed', error: error.message });
  }
};



exports.unittest2 = async (req,res) => {
    try{
    let studentId=req.body.studentId;
    let subject1=req.body.subject1;
    let subject2=req.body.subject2;
    let subject3=req.body.subject3;
    let subject4=req.body.subject4;
    let subject5=req.body.subject5;
    let subject6=req.body.subject6;

      let marks = await rec2.findOne({studentId:studentId});

    marks.ut2.subject1 = subject1 ;
    marks.ut2.subject2 = subject2 ;
    marks.ut2.subject3 = subject3 ;
    marks.ut2.subject4 = subject4 ;
    marks.ut2.subject5 = subject5 ;
    marks.ut2.subject6 = subject6 ;

    await marks.save();

    res.status(200).json({
      success: true,
      message: 'UT2 marks saved successfully',
    
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'UT2 subject entry failed', error: error.message });
  }
};




exports.final = async (req,res) => {
    try{
    let studentId=req.body.studentId;
    let subject1=req.body.subject1;
    let subject2=req.body.subject2;
    let subject3=req.body.subject3;
    let subject4=req.body.subject4;
    let subject5=req.body.subject5;
    let subject6=req.body.subject6;
    let marks = await rec2.findOne({studentId:studentId});

    marks.final.subject1 = subject1 ;
    marks.final.subject2 = subject2 ;
    marks.final.subject3 = subject3 ;
    marks.final.subject4 = subject4 ;
    marks.final.subject5 = subject5 ;
    marks.final.subject6 = subject6 ;

    await marks.save();

    res.status(200).json({
      success: true,
      message: 'final marks saved successfully',

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'final subject entry failed', error: error.message });
  }
};


exports.getunittest1=async(req,res)=>
{
  console.log("req.adm",req.adm);
  studentId=req.adm;
  let data=await rec2.findOne({studentId:studentId.id});
  console.log("data",data);
  return res.status(200).json({success:true,msg:"unittest1 fetched successfully",marks:data.ut1});
}
exports.getunittest2=async(req,res)=>
{
  studentId=req.adm;
  let data=await rec2.findOne({studentId:studentId.id});
  console.log("data",data);
  return res.status(200).json({success:true,msg:"unittest2 fetched successfully",data:data.ut2});
}
exports.getmidTerm=async(req,res)=>
{
  studentId=req.adm;
  let data=await rec2.findOne({studentId:studentId.id});
  console.log("data",data);
  return res.status(200).json({success:true,msg:"midTerm fetched successfully",data:data.midTerm});
}
exports.getfinal=async(req,res)=>
{
  studentId=req.adm;
  let data=await rec2.findOne({studentId:studentId.id});
  console.log("data",data);
  return res.status(200).json({success:true,msg:"final fetched successfully",data:data.final});
}
