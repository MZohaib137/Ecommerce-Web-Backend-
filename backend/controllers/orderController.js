const Orderr=require("../module/ordermodle")
const Errorhandler=require("../utils/ErrorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const Product=require("../module/productmodle")
const User=require("../module/ordermodle")
exports.createOrder=catchAsyncError(async(req,res,next)=>{
    const {
        shipinform,
        orderItems,
        paymentinfor,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    }=req.body
    const order=await Orderr.create(
       {
         shipinform,
        orderItems,
        paymentinfor,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        user:req.user._id,
        paidAt:Date.now()
    }
    )
    res.status(200).json({
        success:true,
        order
    })
})
// get Single Order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Orderr.findById(req.params.id).populate(
      "user",
      "name email"
    );
  
    if (!order) {
      return next(new Errorhandler("Order not found with this Id", 404));
    }
  
    res.status(200).json({
      success: true,
      order,
    });
  });


//login user orders
exports.myOrderrs = catchAsyncError(async (req, res, next) => {
    const orders = await Orderr.find({user:req.user._id})

    res.status(200).json({
      success: true,
      orders,
    });
  });

  // get all Orders -- Admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Orderr.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Orderr.findById(req.params.id);

  if (!order) {
    return next(new Errorhandler("Order not found with this Id", 404));
  }

  if (order.orderStatas === "Delivered") {
    return next(new Errorhandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatas = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAtt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Orderr.findById(req.params.id);

  if (!order) {
    return next(new Errorhandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});

  