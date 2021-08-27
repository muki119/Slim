const mong = require('mongoose');
const { Schema } = mong
// changing schema may cause MongoError: E11000 duplicate key error collection: cluster0.users index: name_1 dup key: { name: null }
const mainschem =  Schema({ // schema to register 
    firstname:{
        type:String,
        required: true
    },

    surname:{
        type:String,
        required: true
    },

    username:{
        type:String, // to have a '@' like twitter at the beginning of the username
        required: true,
        unique:true,
    },

    password:{ // hashed 
        type:String,
        required: true
    },// password - to be hashed 

    email:{ //optional login method possiaby
        type:String, 
        required: true,
        unique:true,
    },

    phonenumber:{
        type:String, //forgot password option 
        default:null
    },

    friends:{type:Array, // friends list
        default:null},

    verified:{ // verification email 
        type:Boolean,
        default:false
    },

    date_created:{
        type:Date,
        default:Date.now()
    }

})

const regimodel = mong.model('users',mainschem,'users')

module.exports = regimodel; // exports model for later use 