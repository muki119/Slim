const {Schema} = require('mongoose');
const database = require("../Database/database.js")
// changing schema may cause MongoError: E11000 duplicate key error collection: cluster0.users index: name_1 dup key: { name: null }
const mainschem =  Schema({ // schema to register 
    firstname:{ // first name of user
        type:String,
        required: true,
    },

    surname:{ // surname of user
        type:String,
        required: true,
    },

    username:{ // username of user
        type:String, // to have a '@' like twitter at the beginning of the username
        required: true,
        unique:true,
    },

    password:{ // hashed -password of user
        type:String,
        required: true
    },// password - to be hashed 

    email:{ //optional login method possiaby - email of user 
        type:String, 
        required: true,
        unique:true,
    },

    phonenumber:{ // phone number of user 
        type:String, //forgot password option 
        default:null
    },

    friends:{type:Array, // friends list
        default:null},

    verified:{ // verification email 
        type:Boolean,
        default:false
    },

    date_created:{ // the date the account was created 
        type:Date,
        default:Date.now
    }

})


const userModel = database.model('users',mainschem,'users')

module.exports = userModel; // exports model for later use 