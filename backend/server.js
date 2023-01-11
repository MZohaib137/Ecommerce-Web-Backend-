const app=require("./app")
const dotenv=require("dotenv")
const mongodb_connection=require("./config/database")
dotenv.config({path:"config/config.env"})

process.on("uncaughtException",(err)=>{
    console.log(`its a variable error ${err.message}`)
    process.exit(1)
    
})


mongodb_connection()

server=app.listen(process.env.PORT,()=>{
    console.log(`Server is Running ${process.env.PORT}`)
})
process.on("unhandledRejection",(err)=>{
    console.log(`Mongodb error ${err.message}`)
    server.close(()=>{
        process.exit(1)
    })
    


})


