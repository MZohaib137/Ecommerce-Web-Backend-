const mongoose=require("mongoose")
const Productschema=new mongoose.Schema({
    name:{
        type:String,
        maxLength:[15,"Only 10 Characters are acceptable"],
        minLength:[2,"Minimum 2 Charecters are acceptable"],
        required:[true,"Enter Product Name"],
        trim:true
    },   
    discription:{
        type:String,
        maxLength:[100,"Discription will be only 100 characters"],
        required:[true,"Enter Discription"],

    },
    price:{
        type:Number,
        required:[true,"Enter Price"],
    },
    ratingg:{
        type:Number,
        default:0
    },
    images:[{
        public_id:{
            type:String,
            required:true
        },
        uri:{
            type:String,
            required:true
        }
    }],
    stock:{
        type:Number,
        default:1
    },
    catagory:{
        type:String,
        required:[true,"Enter Catagory of the product"]
    },
    noofReviews:{
        type:Number,
        default:0
    },
  
    // user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: true
    // },

    reviews:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
            required:true,
            trim:true
        },
        rating:{
            type:Number,
            required:true

        },
        comment:{
            type:String,
            required:true,
        }
    }],
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
module.exports=mongoose.model("Product",Productschema)