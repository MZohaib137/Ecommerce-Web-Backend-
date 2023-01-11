const Doctorsschema=require("../module/doctors")
const Errorhandler=require("../utils/ErrorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")

exports.createDoctor=catchAsyncError(async(req,res)=>{
    const {name,email,discription,Cnic}=req.body
    const Doctor=await Doctorsschema.create({name,email,discription,Cnic})
    res.status(201).json({
        success:true,
        Doctor
    })
})
exports.deleteDoctor = catchAsyncError(async (req, res, next) => {
    const Doctor = await Doctorsschema.findById(req.params.id);
  
    if (!Doctor) {
      return next(new Errorhandler("Doctor not found with this Id", 404));
    } 
  
    await Doctor.remove();
  
    res.status(200).json({
      success: true,
    });
  });
