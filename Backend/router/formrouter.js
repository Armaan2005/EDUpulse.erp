let express=require("express");
const { addquestion, viewAssessment, AssessmentSubmission, ViewResult, viewTitle } = require("../controller/formcontroller");
let router=express.Router();
let auth=require("../middleware/admission");
let staffauth=require("../middleware/staff");

router.post('/addquestion',staffauth,addquestion);
router.get('/viewTitle',auth,viewTitle);
router.get('/viewAssessment/:title',auth,viewAssessment);
router.post('/AssessmentSubmission',auth,AssessmentSubmission);
router.get('/ViewResult/:title',auth,ViewResult);

module.exports=router;