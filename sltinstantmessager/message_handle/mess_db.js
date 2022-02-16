const mongoose = require('mongoose');
require('dotenv').config();


//connect to messages database 
const dburl = process.env.MESSDATABASE_CONURL
const mesdb = mongoose.createConnection(dburl,{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true,useFindAndModify:false},(err)=>{ // makes new connection to databse so no errors
    if (err){
        console.log('messagedb connection error')
        console.log(err)
    }else{
        console.log('Successfull connection to message db')
        
    }
    
}) // connection to database


module.exports = mesdb