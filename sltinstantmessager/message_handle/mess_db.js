const mongoose = require('mongoose');
const dot =require('dotenv').config();


//connect to messages database 
const dburl = process.env.MESSDATABASE_CONURL 
const mesdb = mongoose.createConnection("mongodb+srv://muki11:kimera11@cluster0.tew2a.mongodb.net/mess_db?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true},(err)=>{ // makes new connection to databse so no errors
    if (err){
        console.log('messagedb connection error')
        console.log(err)
    }else{
        console.log('Successfull connection to message db')
        
    }
    
}) // connection to database


module.exports = mesdb