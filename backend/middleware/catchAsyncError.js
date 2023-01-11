module.exports=(thefu)=>(req,res,next)=>{
    Promise.resolve(thefu(req,res,next)).catch(next)
}