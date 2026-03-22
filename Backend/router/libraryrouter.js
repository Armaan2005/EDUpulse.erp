let express=require("express");
let router=express.Router();
let auth=require("../middleware/admission");
let auths=require("../middleware/admin");
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

const { addbook, viewbook, deletebook,issuebook,returnbook,issued, penalty, viewactivity, currentissued, viewallpenalty , viewpenalty , penaltyreminder , paypenalty } = require("../controller/librarycontroller");
router.post("/addbook",auths,upload.single("image"),addbook);
router.get("/viewbook",auths,viewbook);
router.delete("/deletebook/:id",auth,deletebook);
router.post("/issuebook",auth,issuebook);
router.post("/returnbook",auth,returnbook);
router.get("/issued",auth,issued);
router.post("/penalty",auth,penalty);
router.get("/viewactivity",auths,viewactivity);
router.get("/currentissued",auths,currentissued);
router.get("/viewpenalty",auth,viewpenalty);
router.get("/viewallpenalty",auths,viewallpenalty);
router.post("/penaltyreminder",auths,penaltyreminder);
router.post("/paypenalty",auth,paypenalty);

module.exports=router;