const mongoose=require("mongoose")
const Patientschema=new mongoose.Schema({
   
    Cnic:{
        type:Number,
        required:[true,"Enter your CNIC"],
        maxLength:[13,"Name is only about 13 Characters"],
        trim:true
    }
})
module.exports=mongoose.model("Patient",Patientschema)