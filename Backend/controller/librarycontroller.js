const { addbook, viewbook, deletebook,issuebook ,returnbook,issued, penalty, viewactivity, currentissued, penaltyreminder, paypenalty, viewpenalty, viewallpenalty} = require("../service/libraryservice");

exports.addbook=async(req,res)=>
{
    await addbook(req,res);
}
exports.viewbook=async(req,res)=>
{
    await viewbook(req,res);
}
exports.deletebook=async(req,res)=>
{
    await deletebook(req,res);
}
exports.issuebook=async(req,res)=>
{
    await issuebook(req,res);
}

exports.returnbook=async(req,res)=>
{
    await returnbook(req,res);
}
exports.issued=async(req,res)=>
{
    await issued(req,res);
}

exports.penalty=async(req,res)=>
{
    await penalty(req,res);
}

exports.viewactivity=async(req,res)=>{
    await viewactivity(req,res);
}
exports.currentissued=async(req,res)=>{
    await currentissued(req,res);
}

exports.penaltyreminder = async (req, res) => {
    await penaltyreminder(req, res);
}

exports.paypenalty = async (req, res) => {
    await paypenalty(req, res);
}

exports.viewpenalty = async (req, res) => 
{
    await viewpenalty(req, res);
}

exports.viewallpenalty = async (req, res) =>
{
    await viewallpenalty(req, res);
}    