let express= require("express");
const { addnotice, viewnotice, deletenotice } = require("../controller/noticecontroller");
const auth = require("../middleware/admin");
let router = express.Router();  
router.post('/addnotice',auth, addnotice);
router.get('/viewnotice', viewnotice);
router.delete('/deletenotice/:id', deletenotice);
module.exports = router;
