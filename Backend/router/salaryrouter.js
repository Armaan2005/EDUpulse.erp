let express=require("express");
const { salaryregister, salarydelete, salaryupdate, salaryview, viewbyid, salarypayment } = require("../controller/salarycontroller");
let router=express.Router();
const auth = require("../middleware/admin");

router.post('/salaryregister',auth,salaryregister);
router.get('/salaryview',auth,salaryview);
router.put('/salaryupdate/:id',salaryupdate);
router.delete('/salarydelete/:id',salarydelete);
router.get("/viewbyidsal/:id",viewbyid);
router.post('/salarypayment',auth,salarypayment);

module.exports=router;