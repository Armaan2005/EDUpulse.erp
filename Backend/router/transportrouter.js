const express = require('express');
const { conditionupdate, updatecondition, studenttransportview, studenttransportdetails,  viewdrivers, driverdetails, conditionview, addroute, viewroutes, viewroutebyid, viewallstudenttransport } = require('../controller/transport');
const router = express.Router();
let auth=require('../middleware/admin');
let auths=require('../middleware/admission');
const { viewroutes2 } = require('../service/transportservice');

router.post('/conditionupdate',auth,conditionupdate);
router.put('/conditionupdate/:id',auth,updatecondition);
router.get('/conditionview',auth,conditionview);
router.post('/driverdetails',auth,driverdetails);
router.get('/viewdrivers',auth,viewdrivers);
router.post('/studenttransportdetails',auths,studenttransportdetails);
router.get('/studenttransportview',auths,studenttransportview);
router.post('/addroute',auth,addroute);
router.get('/viewroutes',auth,viewroutes);
router.get('/viewroutebyid/:id',viewroutebyid);
router.get('/viewallstudenttransport',auth,viewallstudenttransport);
router.get('/viewroutes2',auths,viewroutes2);

module.exports = router;
