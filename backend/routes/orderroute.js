const express=require("express")
const router=express.Router()
const {createOrder,myOrderrs,getSingleOrder,getAllOrders,updateOrder,deleteOrder}=require("../controllers/orderController")
const {isAuthenticated,authorize}=require("../middleware/auth")
router.route("/order/create").post(isAuthenticated,createOrder)
router.route("/order/getorder/:id").get(isAuthenticated,authorize("admin"),getSingleOrder)
router.route("/order/myorderrs").get(isAuthenticated,myOrderrs)
router.route("/order/allorders").get(isAuthenticated,authorize("admin"),getAllOrders)
router.route("/order/updateorder/:id").put(isAuthenticated,authorize("admin"),updateOrder).delete(isAuthenticated,authorize("admin"),deleteOrder)

module.exports=router