const Patientschema=require("../module/patient")
const catchAsyncError = require("../middleware/catchAsyncError")



exports.createPatient=catchAsyncError(async(req,res)=>{
    const {Cnic}=req.body
    const Patient=await Patientschema.create({Cnic})
    res.status(201).json({
        success:true,
        Patient
    })
})