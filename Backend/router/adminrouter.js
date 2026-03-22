let express=require("express");
let auth=require("../middleware/admin")
let router=express.Router();
const { adminregister, adminlogin, adminprofile, adminlogout, dashboard } = require("../controller/admincontroller");
router.post("/adminregister",adminregister);
router.post("/adminlogin",adminlogin);
router.get('/adminprofile',auth, adminprofile);
router.get("/adminlogout",auth,adminlogout);
router.get("/dashboard",dashboard);

module.exports=router;