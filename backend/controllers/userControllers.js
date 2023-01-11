const catchAsyncError = require("../middleware/catchAsyncError")
const User=require("../module/usermodule")
const Errorhandler = require("../utils/ErrorHandler")
const sendToken=require("../utils/tokenjwt")
const sendEmail=require("../utils/sendEmail")
const crypto=require("crypto")
exports.createUser=catchAsyncError(async(req,res,next)=>{
  // if (req.body.googleAccessToken) {
  //   const {googleAccessToken} = req.body;

  //   axios
  //       .get("https://www.googleapis.com/oauth2/v3/userinfo", {
  //       headers: {
  //           "Authorization": `Bearer ${googleAccessToken}`
  //       }
  //   })
  //       .then(async response => {
  //           const name = response.data.given_name;
  //           const email = response.data.email;
  //           const picture = response.data.picture;

  //           const existingUser = await User.findOne({email})

  //         if (existingUser) {
  //               return res.status(400).json({message: "User already exist!"})}

  //         const user = await User.create({verified:"true",email,name,avatar: picture})  
  //         sendToken(user,201,res)
  //           }) 
  //                          }
   
  //   else {
           const {name,email,password}=req.body
           const user= await User.create({
           name,email,password
         
                   } 
                                         )
                  //  ,
                   //   avatar:{
                   //   public_id:"this is public id",
                   //   url:"profilepicurl"
    sendToken(user,201,res)
  }


)
exports.login=catchAsyncError(async(req,res,next)=>{
  // if(req.body.googleAccessToken){
  //   // gogole-auth
  //   const {googleAccessToken} = req.body;

  //   axios
  //       .get("https://www.googleapis.com/oauth2/v3/userinfo", {
  //       headers: {
  //           "Authorization": `Bearer ${googleAccessToken}`
  //       }
  //   })
  //       .then(async response => {
  //           const name = response.data.given_name;
  //           const email = response.data.email;
  //           const avatar = response.data.picture;
  //           const existingUser = await User.findOne({email})

  //           if (!existingUser) 
  //           return res.status(404).json({message: "User don't exist!"})
            
  //           sendToken(existingUser,200,res)
  //         })  }
  //   else {
    const {email,password}=req.body
    if(!email||!password){
        return next(new Errorhandler("Enter Email and Password",401))
    }
    const user=await User.findOne({email}).select("+password")
    if(!user){
        return next(new Errorhandler("Wrong Email or Password",401))
    }
    const ispasswordmatched=user.comparepassword(password)
    if(!ispasswordmatched){
        return next(new Errorhandler("Wrong Email or Password",401))

    }
    sendToken(user,200,res)
    
  }
// }
)
exports.logout=catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null,
   {expires:new Date(Date.now()),httpOnly:true}
    )
    res.status(200).json({
        success:true,
        message:"Logout Successful"
    })
})
exports.forgotpassword=catchAsyncError(async(req,res,next)=>{
    const user= await User.findOne({email:req.body.email})
    if (!user){
       return  next(new Errorhandler("Email Not found",404) )
    }
    const resetToken=user.getresetPasswordToken()
    await user.save({validateBeforeSave:false})
    const resetUrl=`${req.protocol}://${req.get("host")}/app/resetpassword${resetToken}`
    const message=`your reset password url is here ${resetUrl}`

    try{
        await sendEmail({
            email:user.email,
            subject:"password recovery",
            message,
        })
         res.status(200).json({
            success:true,
            message:`email sent to ${user.email} successfuly`
        })
    }catch(error){
        user.resetPasswordToken=undefined,
        user.resetPasswordExpire=undefined,
         await user.save({validateBeforeSave:false})
         return next (new Errorhandler(error.message,500))
    }

})
exports.resetpassword=catchAsyncError(async(req,res,next)=>{
    const resetPasswordToken=crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })

if (!user){
        return next(new Errorhandler("Reset password token is invalid and has been expired",400))
    }
if(req.body.password!==req.body.confirmPassword){
    return next(new Errorhandler("Passsword dos'nt password",400))

}

user.password=req.body.password;
user.resetPasswordToken=undefined
user.resetPasswordExpire=undefined
await user.save()
sendToken(user,200,res)

})
////////////////
// Get User Detail
exports.getUserDetails = catchAsyncError(async (req, res,next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    });
  });
  
  // update User password
  exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
  
    const isPasswordMatched = await user.comparepassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new Errorhandler("Old password is incorrect", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new Errorhandler("password does not match", 400));
    }
  
    user.password = req.body.newPassword;
  
    await user.save();
  
    sendToken(user, 200, res);
  });
  // update User Role -- Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Delete User --Admin
  exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new Errorhandler(`User does not exist with Id: ${req.params.id}`, 400)
      )
    }
    await user.remove();

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  });
  exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new Errorhandler(`User does not exist with Id: ${req.params.id}`)
      );
    }
  
    res.status(200).json({
      success: true,
      user,
    });
  });
  exports.getAllUser = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      success: true,
      users,
    });
  });
  exports.updateprofile=catchAsyncError(async (req,res,next)=>{
    const newdata={
        name:req.body.name ,
        email:req.body.email,
        role:req.body.role

    }
    const user=await User.findByIdAndUpdate(req.user.id,newdata,{
        new:true,runValidators:true,useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        
    })
  })