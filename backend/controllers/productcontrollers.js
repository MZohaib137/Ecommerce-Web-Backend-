const Product=require("../module/productmodle")
const Apifeature=require("../utils/Apifeatures")
const Errorhandler=require("../utils/ErrorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")


//Admin
exports.createproduct=catchAsyncError(async(req,res)=>{
        req.body.user=req.body.id
        const productt=await Product.create(req.body)
        res.status(201).json({
            success:true,
            productt
        })
})

//Admin And 
exports.getproduct=catchAsyncError(async(req,res)=>{
    const resultperpage=5
    const apifeatures=new Apifeature(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultperpage)
   
    const productt=await apifeatures.query
    res.status(200).json({
        success:true,
        productt
    })
})


exports.Updateproduct=catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new Errorhandler("Product Not Found",404))
    }
    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,runValidators:true,useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        product
    })
})
exports.deleteproduct=catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new Errorhandler("Product Not Found",404))
    }
     await product.deleteOne()
    res.status(200).json({
        success:true,
        
    })
})
exports.detailsproduct=catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new Errorhandler("Product Not Found",404))
    }
     
    res.status(200).json({
        success:true,
        product
    })
})
exports.createproductreview=catchAsyncError(async(req,res,next)=>{
    const{rating,comment,productId}=req.body
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product=await Product.findById(productId)
    const Reviwed=product.reviews.find(
        (rev)=>rev.user.toString()===req.user._id.toString()
    )
    if (Reviwed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString()===req.user._id.toString()){
                rev.rating=rating,
                rev.comment=comment
            }
        })
    }
    else{
        product.reviews.push(review)
        product.noofReviews=product.reviews.length
    }

    let avg=0
    product.reviews.forEach((rev)=>{
        avg+=rev.rating
    })
    product.ratingg=avg/product.reviews.length
    await product.save({validateBeforeSave:false})
    res.status(200).json({
        success:true
    })

})
// Get All Reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new Errorhandler("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });
  exports.deletereview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)
    if (!product) {
        return next(new Errorhandler("Product not found", 404));
      }
      const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
      );
    
      let avg = 0;
    
      reviews.forEach((rev) => {
        avg += rev.rating;
      });
    const ratingg=avg/reviews.length
    const noofReviews=reviews.length
    await Product.findByIdAndUpdate(req.query.productId,
        {reviews ,ratingg,noofReviews},{
            new:true,runValidators:true,useFindAndModify:false
        })
      res.status(200).json({
        success: true,
      });

  })
