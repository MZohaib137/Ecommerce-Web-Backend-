const express=require("express")
const router=express.Router()
const {createDoctor,deleteDoctor}=require("../controllers/doctorscontroller")
const {isAuthenticated,authorize}=require("../middleware/auth")
router.route("/doctor/creat").post(isAuthenticated,authorize("admin"),createDoctor)
router.route("/doctor/delete/:id").delete(isAuthenticated,authorize("admin"),deleteDoctor)
module.exports = router;