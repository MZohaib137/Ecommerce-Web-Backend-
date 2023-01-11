const express=require("express")
const router=express.Router()
const {Memberscreate,MembersDelete}=require("../controllers/memberscontroller")
const {isAuthenticated,authorize}=require("../middleware/auth")
router.route("/members/creat").post(isAuthenticated,Memberscreate)
router.route("/members/delete/:id").delete(isAuthenticated,authorize("admin"),MembersDelete)

module.exports = router;


