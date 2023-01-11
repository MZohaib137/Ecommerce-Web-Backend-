const Errorhandler = require("../utils/ErrorHandler")
const jwt=require("jsonwebtoken")
const catchAsyncError = require("./catchAsyncError")
const User=require("../module/usermodule")

exports.isAuthenticated=catchAsyncError(async(req,res,next)=>{
    const {token}=req.cookies
    if(!token){
        return next(new Errorhandler("For Accessing that resource Login First",401))
    }
    const decodedata=jwt.verify(token,process.env.JWT_SECERT)
    req.user=await User.findById(decodedata.id)
    next()
})
exports.authorize=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new Errorhandler("Your Role don't allow you to access that resource",403))
        }
        next()
    }
  
}


