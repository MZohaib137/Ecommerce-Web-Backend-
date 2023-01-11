const express=require("express")
const router=express.Router()
const {createPatient}=require("../controllers/patientcontroller")
const {isAuthenticated}=require("../middleware/auth")
router.route("/patient/create").post(isAuthenticated,createPatient)
module.exports = router;
