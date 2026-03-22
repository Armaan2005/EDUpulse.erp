const { admission,admissionlogin,studentprofile,viewstudent,payfee,viewbyids,studentprofile2, viewbyidstudent, updatestudent, studentDashboard, deletestudent} = require("../service/admissionservice");

exports.admission=async(req,res)=>
{
 await admission(req,res);
}

exports.admissionlogin=async(req,res)=>
{
 await admissionlogin(req,res);

}

exports.studentprofile=async(req,res)=>
{  
    await studentprofile(req,res);
 
}

exports.viewstudent=async(req,res)=>
{
    await viewstudent(req,res);
}

exports.payfee=async(req,res)=>
{
    await payfee(req,res);  
}

exports.viewbyids=async(req,res)=>
{
    await viewbyids(req,res);
}

exports.studentprofile2=async(req,res)=>
{
    await studentprofile2(req,res);
}

exports.updatestudent=async(req,res)=>
{
    await updatestudent(req,res);
}

exports.viewbyidstudent=async(req,res)=>
{
    await viewbyidstudent(req,res);
}

exports.studentDashboard=async(req,res)=>
{
    await studentDashboard(req,res);
}

exports.deletestudent=async(req,res)=>
{
    await deletestudent(req,res);
}