let express=require("express");
let auth=require("../middleware/admission");
let auths=require("../middleware/admin");
let authss=require("../middleware/staff");
let router=express.Router();
const multer = require("multer");
let upload =multer({ 
    storage:multer.diskStorage({
        destination:(req, file, cb)=>{
            cb(null,"./public/images");
        },
        filename:(req,file,cb)=>{
            cb(null, file.originalname);
        }
    })
})

const { admission,admissionlogin,studentprofile,viewstudent,viewbyids,payfee,studentprofile2, updatestudent, viewbyidstudent, studentDashboard, deletestudent} = require("../controller/admissioncontroller");
const { updatestudentpersonal } = require("../service/admissionservice");

router.post("/admission",auths,admission);
router.post("/admissionlogin",admissionlogin);
router.get("/studentprofile",auth,studentprofile);
router.get("/viewstudent",authss,viewstudent);
router.post("/payfees",auth,payfee);
router.get("/viewbyids/:id",viewbyids);
router.get("/studentprofile2",auth,studentprofile2);
router.put("/updatestudent/:id",updatestudent);
router.get("/viewbyidstudent/:id",viewbyidstudent);
router.get("/studentdashboard",auth,studentDashboard);
router.delete("/deletestudent/:id",deletestudent);
router.put("/updatestudentpersonal",auth,updatestudentpersonal);

module.exports=router;