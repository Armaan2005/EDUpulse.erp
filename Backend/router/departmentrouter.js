let express=require("express");
const {  adddepartment, viewdepartment, deletedepartment, updatedepartment, Dviewbyid } = require("../controller/departmentcontroller");
let router=express.Router();
let auth=require("../middleware/admin");

router.post("/adddepartment",auth,adddepartment);
router.get("/viewdepartment",auth,viewdepartment);
router.delete("/deletedepartment/:id",deletedepartment);
router.put("/updatedepartment/:id",updatedepartment);
router.get("/Dviewbyid/:id",Dviewbyid);


module.exports=router;