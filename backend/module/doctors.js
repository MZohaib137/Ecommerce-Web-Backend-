const mongoose=require("mongoose")
const validator=require("validator")
const Doctorsschema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter your name"],
        maxLength:[20,"Name is only about 20 Characters"],
        minLength:[4,"Name Should be more than 2 characters"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Enter your Email"],
        unique:true,
        validate:[validator.isEmail,"Enter a correct Email"]
    },
    Cnic:{
        type:String,
        required:[true,"Enter your CNIC"],
        maxLength:[13,"Name is only about 13 Characters"],
        trim:true
    },
    discription:{
        type:String,
        required:[true,"Enter discription"],
        trim:true
    },
})
module.exports=mongoose.model("Doctors",Doctorsschema)