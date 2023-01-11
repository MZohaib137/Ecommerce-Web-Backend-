const express=require("express")
const router=express.Router()
const {isAuthenticated,authorize}=require("../middleware/auth")
const {createUser,login,logout,forgotpassword,resetpassword,
    getUserDetails,updatePassword,getAllUser,updateUserRole,deleteUser,getSingleUser}=require("../controllers/userControllers")
router.route("/register").post(createUser)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/forgotpassword").post(forgotpassword)
router.route("/resetpassword/:token").put(resetpassword)
router.route("/me/:id").get(isAuthenticated,getUserDetails)
router.route("/updatepasswordme/:id").put(isAuthenticated,updatePassword)

router
  .route("/admin/users")
  .get(isAuthenticated, authorize("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticated, authorize("admin"), getSingleUser)
  .put(isAuthenticated, authorize("admin"), updateUserRole)
  .delete(isAuthenticated, authorize("admin"), deleteUser)

module.exports = router;

module.exports=router
