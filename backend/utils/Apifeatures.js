class Apifeature{
    constructor(query,querystr){
        this.query=query
        this.querystr=querystr
    }
    search(){
        const keyword=this.querystr.keyword?{
            name:{
                $regex:this.querystr.keyword,
                $options:'i'
            }
           
        }:{}
        this.query=this.query.find({...keyword})
        return this
    }
    filter(){
       
        const querycopy={...this.querystr}
        const  removefields=["keyword","page","limit"]
        removefields.forEach((key)=>{delete querycopy[key]}
       )
       //for price filtering and rating
       let queryStr=JSON.stringify(querycopy)
       queryStr=queryStr.replace(/\b(gt||gte||lt||lte)\b/g,(key)=>`$${key}`)
       this.query=this.query.find(JSON.parse(queryStr))
       
       return this
       
       
    }
   pagination(resultperpage){
       const currentpage=Number(this.querystr.page)
       const skip=resultperpage*(currentpage-1)
       this.query=this.query.limit(resultperpage).skip(skip) 
       return this

   }
}
module.exports=Apifeature