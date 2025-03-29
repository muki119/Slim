const mong = require('mongoose');//database connection (use environments)
const dot =require('dotenv')
dot.config();

var url = process.env.DATABASE_CONURL
mong.connect(url,{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true,useFindAndModify:false},(err)=>{
    if (err){
        console.log('maindb connection error')
        console.log(err)
    }else{
      console.log('Successfull main db connection')  
    }
})


module.exports = mong