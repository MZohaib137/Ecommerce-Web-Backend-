const express=require("express")
const {createproduct,
    getproduct,
    Updateproduct,
    deleteproduct,
    detailsproduct,
    createproductreview,
    getProductReviews,
    deletereview} =require("../controllers/productcontrollers")
const router=express.Router()
const {isAuthenticated,authorize}=require("../middleware/auth")

router.route("/productcreate").post(isAuthenticated,createproduct)
router.route("/product").get(getproduct)
// isAuthenticated,authorize("admin"),
router.route("/product/:id").get(isAuthenticated,authorize("admin"),detailsproduct).delete(isAuthenticated,authorize("admin"),deleteproduct)
.put(isAuthenticated,authorize("admin"),Updateproduct)
router.route("/review").put(isAuthenticated,authorize("admin"),createproductreview)
router.route("/reviews")
.get(getProductReviews).delete(isAuthenticated,authorize("admin"),deletereview)

module.exports=router