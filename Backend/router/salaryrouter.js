let express=require("express");
const { salaryregister, salarydelete, salaryupdate, salaryview, viewbyid, salarypayment, paymentview, staffpaymentview } = require("../controller/salarycontroller");
let router=express.Router();
const auth = require("../middleware/admin");
const staffauth = require("../middleware/staff");

router.post('/salaryregister',auth,salaryregister);
router.get('/salaryview',auth,salaryview);
router.put('/salaryupdate/:id',salaryupdate);
router.delete('/salarydelete/:id',salarydelete);
router.get("/viewbyidsal/:id",viewbyid);
router.post('/salarypayment',auth,salarypayment);
router.get('/paymentview',auth,paymentview);
router.get('/staffpaymentview',staffauth,staffpaymentview);

module.exports=router;