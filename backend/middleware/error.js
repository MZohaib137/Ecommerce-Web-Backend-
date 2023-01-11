const ErrorHandler=require("../utils/ErrorHandler")
module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500,
    err.message=err.message||"Invalid Server Error"

    //cast error
    if(err.name==="CastError"){
        const message=`Error is about ${err.path}`
        err=new ErrorHandler(message,400)
    }
    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}
