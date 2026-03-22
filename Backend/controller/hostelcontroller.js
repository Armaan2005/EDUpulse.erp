const { addroom, viewroom, updateroom, studentregister, feespayment, viewstudenthostel, studenthostelview, sendfeesreminder } = require("../service/hostelservice")


exports.addroom=async(req,res)=>
{
    await addroom(req,res);
}
exports.viewroom=async(req,res)=>
{
    await viewroom(req,res);
}
exports.updateroom=async(req,res)=>
{
    await updateroom(req,res);
}
exports.studentregister = async (req, res) => {
await studentregister(req, res);
    }

exports.feespayment=async(req,res)=>
    {
        await feespayment(req,res);
    }    


    exports.viewstudenthostel=async(req,res)=>
    {
        await viewstudenthostel(req,res);
    }

exports.studenthostelview=async(req,res)=>
    {
        await studenthostelview(req,res);
    }    

exports.sendfeesreminder=async(req,res)=>
    {
        await sendfeesreminder(req,res);
    }    