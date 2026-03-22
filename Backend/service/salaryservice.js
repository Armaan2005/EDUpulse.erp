let rec=require("../models/salary");
let payment=require("../models/payment");
let staff=require("../models/staff");


exports.salaryregister=async(req,res)=>
{ 
    console.log("hiiii");
    let admin=req.admin;
    console.log("admin",admin);
    if(!admin){
        return res.status(401).json({success:false,msg:'Unauthorized access'});
    }
let department=req.body.department;
let employee=req.body.employee;
let basicsalary=req.body.basicsalary;
let allowance=req.body.allowance;
let deduction=req.body.deduction;
let paydate=req.body.paydate;
existsalary=await rec.findOne({employee:employee});
if(existsalary){
    return res.status(400).json({success:false,msg:'Salary for this employee already exists'});
}
let data=await rec.find();
if(data.length==0)
{
    const id=1;
    let record=new rec({id:id,department:department,employee:employee,basicsalary:basicsalary,allowance:allowance,deduction:deduction,paydate:paydate});
    await record.save();
    return res.status(200).json({success:true,msg:'salary git registered'});
}
else{
    const id=data.length+1;
    let record=new rec({id:id,department:department,employee:employee,basicsalary:basicsalary,allowance:allowance,deduction:deduction,paydate:paydate});
    await record.save();
    return res.status(201).json({success:true,msg:'salary git restired'});
}
    
}

exports.salaryview=async(req,res)=>
{       
        let admin=req.admin;
        if(!admin){
            return res.status(401).json({success:false,msg:'Unauthorized access'});
        }
        let salarylist = await rec.find();
        console.log(salarylist);
        if (salarylist.length === 0) {
            return res.status(404).json({ success: false, msg: 'No salary found' });
        }

        return res.status(200).json({success: true,msg: 'All staff details fetched successfully',
            salary: salarylist.map(salary => ({
                _id:salary._id,
                department:salary.department,
                employee:salary.employee,
                basicsalary:salary.basicsalary,
                allowance:salary.allowance,
                deduction:salary.deduction,
                paydate:salary.paydate,
                id:salary.id,
            }))
        });


}

exports.salaryupdate = async (req, res) => {
    try {
        const id = req.params.id; 
        const updatedData = req.body; 

        let record = await rec.findByIdAndUpdate(
            id, 
            updatedData, 
            { new: true, runValidators: true } 
        );

        if (!record) {
            return res.status(404).json({ success: false, msg: "Salary record not found for update." });
        }
        
        return res.status(200).json({ success: true, msg: "Salary updated successfully", salary: record });

    } catch (err) {
        console.error("Salary update error:", err);
        return res.status(500).json({ success: false, msg: "Server error or invalid ID format during update." });
    }
};

exports.salarydelete=async(req,res)=>
{
    console.log('hello');
    let id=req.params.id;
    await rec.deleteOne({_id:id});
    return res.status(200).json({success:true,msg:"delete successfully!!"});
}
exports.viewbyid=async(req,res)=>
{
 try {

const salaryId = req.params.id;
 console.log(salaryId);
 let salary = await rec.findOne({ _id: salaryId });
 if (!salary) {
 return res.status(404).json({ success: false, msg: "Salary not found" });
 }
 return res.status(200).json({
 success: true,
 msg: "Salary details fetched successfully",
 salary: salary, 
 });
} catch (err) {
 console.error(err);
 return res.status(500).json({ success: false, msg: "Server error" });
 }
}

exports.salarypayment=async(req,res)=>
{
    let admin=req.admin;
    if(!admin){
        return res.status(401).json({success:false,msg:'Unauthorized access'});
    }
    let salaryId=req.body.salaryId;
    let month=req.body.month;
    let paymentDate=req.body.paymentDate;
    let salaryRecord=await rec.findOne({_id:salaryId});
    if(!salaryRecord){
        return res.status(404).json({success:false,msg:'Salary record not found'});
    }
    
    let staffRecord=await staff.findOne({name:salaryRecord.employee});
    let existingPayment=await payment.findOne({staffId:staffRecord.id, month:month});
    if(existingPayment){
        return res.status(400).json({success:false,msg:'Salary for this month already paid'});
    }
    
     totalAmount=salaryRecord.basicsalary+salaryRecord.allowance-salaryRecord.deduction;
    let record=new payment({
        staffId:staffRecord.id,
        staffName:salaryRecord.employee,
        staffMail:staffRecord.email,
        staffDepartment:salaryRecord.department,
        amount:totalAmount,
        month:month,
        paymentDate:paymentDate
    });
    await record.save();
    return res.status(200).json({success:true,msg:'Salary payment recorded successfully'});
}

exports.paymentview=async(req,res)=>
{
    let admin=req.admin;
    if(!admin){
        return res.status(401).json({success:false,msg:'Unauthorized access'});
    }
    let payments=await payment.find();
    if(payments.length==0){
        return res.status(404).json({success:false,msg:'No payment records found'});
    }
    return res.status(200).json({success:true,msg:'All payment records fetched successfully',payment:payments});

}

exports.staffpaymentview=async(req,res)=>
{
    let staff=req.staff;
    if(!staff){
        return res.status(401).json({success:false,msg:'Unauthorized access'});
    }
    let payments=await payment.find({staffId:staff.id});
    if(payments.length==0){
        return res.status(404).json({success:false,msg:'No payment records found for this staff'});
    }
    return res.status(200).json({success:true,msg:'Payment records for staff fetched successfully',payment:payments});
}

