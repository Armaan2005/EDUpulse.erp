let mongo=require("mongoose");
let submission=mongo.Schema({
   studentId:{type:String},
   studentName:{type:String},
   studentEmail:{type:String},
   assignId:{type:String},
   submissionFile:{type:String},
   staffId:{type:String},
    
});
module.exports=mongo.model('submission',submission);