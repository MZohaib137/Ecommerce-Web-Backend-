const mongoose=require("mongoose")
const mongodb_connection=()=>{
    mongoose.connect(process.env.URI)
            .then((data)=>{
                console.log(`mongodb connect with server: ${data.connection.host}`);

            })
}
module.exports=mongodb_connection
