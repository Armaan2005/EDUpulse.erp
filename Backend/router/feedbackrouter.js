let express=require("express");
const {addfeedback,viewfeedback } = require("../controller/feedback");
let router=express.Router();
let auth=require("../middleware/admin");
let studentauth=require("../middleware/admission");

router.post("/addfeedback",studentauth,addfeedback);
router.get("/viewfeedback",auth,viewfeedback);



module.exports=router;