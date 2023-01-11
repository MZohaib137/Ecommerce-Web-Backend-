const Membersschema=require("../module/members")
const Errorhandler=require("../utils/ErrorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")

exports.Memberscreate=catchAsyncError(async(req,res)=>{
    const {name,email,Cnic}=req.body
    const Members=await Membersschema.create({name,email,Cnic })
    res.status(201).json({
        success:true,
        Members
    })
})
exports.MembersDelete = catchAsyncError(async (req, res, next) => {
    const Members = await Membersschema.findById(req.params.id);
    if (!Members) {
      return next(new Errorhandler("Members not found with this Id", 404));
    }
  
    await Membersschema.remove();
  
    res.status(200).json({
      success: true,
    });
  });
