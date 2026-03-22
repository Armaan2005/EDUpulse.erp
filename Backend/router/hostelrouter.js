let express=require("express");
const { addroom, viewroom, updateroom, studentregister, feespayment, studenthostelview, viewstudenthostel, sendfeesreminder } = require("../controller/hostelcontroller");
let router=express.Router();
let auth=require("../middleware/admission");
let auths=require("../middleware/admin");
const { viewfees } = require("../service/hostelservice");

router.post("/addroom",auths,addroom);
router.get("/viewroom",viewroom);
router.put("/updateroom/:id",updateroom);
router.post("/studentregister",auth,studentregister);
router.post("/feespayment",auth,feespayment);
router.get("/viewstudenthostel",auth,viewstudenthostel);
router.get("/viewfees",auth,viewfees);
router.get("/studenthostelview",auths,studenthostelview);
router.post("/sendfeesreminder",auths,sendfeesreminder);
module.exports=router;