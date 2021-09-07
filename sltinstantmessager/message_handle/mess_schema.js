const mesdb = require('./mess_db') // message database connection
const mong = require('mongoose')
const { Schema } = mong


//new conversation schema
const newconv = Schema({
    users_involved:{
        type:Array,
        required:true,
    },
    date_created:{
        type:Date,
        default:Date.now()
    },
    last_messaged:{ // sort by last messaged
        type:Date,
        default:Date.now()
    },
    messages:{//array containing objects with{sender:string,message:string,timesent:date,}
        type:[String] // initial one should be 
    }
});

const ncmodel = mesdb.model('mess_col',newconv,'mess_col') // create conversation model

module.exports = ncmodel // newconversation model