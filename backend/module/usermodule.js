const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const crypto=require("crypto")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter your name"],
        maxLength:[20,"Name is only about 20 Characters"],
        minLength:[1,"Name Should be more than 2 characters"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Enter your Email"],
        unique:true,
        validate:[validator.isEmail,"Enter a correct Email"]
    },
    password:{
        type:String,
        required:[true,"Enter your Password"],
        minLength:[8,"Password Should be more than or equal to 8 characters"],
        select:false
    },
    // avatar:{
    //      type:String,
    //      required:false,
    //     public_id:{
    //         type:String,
    //         required:false
    //     },
    //     url:{
    //         type:String,
    //         required:false
    //     }
    // },
    
    role: {
        type:String,
        enum: ["admin", "user"],
        default: "user",
      },
    // GId: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //   },

    resetPasswordToken:String,
    resetPasswordExpire:Date
})
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcrypt.hash(this.password,10)
})
userSchema.methods.comparepassword=async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password)
}
userSchema.methods.jwtToken= function(){
    return  jwt.sign({id:this.id},process.env.JWT_SECERT,
        {expiresIn:process.env.JWT_EXPIRE}
        )
        
}
userSchema.methods.getresetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken=crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
    this.resetPasswordExpire=Date.now()+15*60*1000
    return resetToken
}
module.exports=mongoose.model("user",userSchema)