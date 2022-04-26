const mesdb = require('../Database/database.js') // message database connection
const { Schema }= require('mongoose')
const { v4: uuidv4 } = require('uuid'); // unique chat identifier -different from document _id 



//new conversation schema
const newConv = Schema({
    chat_id:{
        type:String,
        required:true,
        unique:true,
        default:uuidv4
    },
    users_involved:{
        type:Array,
        required:true,
    },
    date_created:{
        type:Date,
        default:Date.now
    },
    last_messaged:{ // sort by last messaged
        type:Date,
        default:Date.now
    },
    messages:{//array containing objects with{sender:string,message:string,timesent:date,}
        type:[] // initial one should be 
    }
});

const newConversationModel = mesdb.model('messageCollection',newConv,'messageCollection') // create conversation model

module.exports = newConversationModel // newconversation model