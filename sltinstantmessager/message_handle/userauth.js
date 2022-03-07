const Usermodel = require('../userschema/userschema')// register schema 
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const AES = require("crypto-js/aes");
const Utf8 = require('crypto-js/enc-utf8')


function sendinvalid(res){
    //res.clearCookie('SID')
    res.status(200).send({auth_error:'Invalid auth',validjwt:false});
}
function decryptuserdetails(decrypted_jwt){
    return JSON.parse(AES.decrypt(decrypted_jwt.UD,`${process.env.AES_KEY}`).toString(Utf8))
}

function userauth (req,res,next){// this checks the jwt sent alongside to verify that what is sent is the user // this process should also be rate limited as the login one and register 
   try{
        if (!req.cookies.SID){
            sendinvalid(res)
        }else if (req.cookies.SID){
            const uat = req.cookies.SID// Uat stands for user authentication /authorization token 
            try{
                jwt.verify(uat,process.env.JWTSK,(err,decrypted_jwt)=>{
                    try {
                        decrypted_jwt = decryptuserdetails(decrypted_jwt)  // decrypts the ud
                        if ( decrypted_jwt.username && decrypted_jwt.username === req.body.username){
                            Usermodel.findOne({username:decrypted_jwt.username},'password',(error,data)=>{ // data is the found user 
                                if (!error){
                                    if (data == null) { // if theres no user matching the description then say that user cannot be found 
                                        console.log('user is not found')
                                        sendinvalid(res)
                                    }else{ //otherwise there is a matching user 
                                        bcrypt.compare(decrypted_jwt.password,data.password,async (err, result) =>{
                                            if (!err && result == true){  // if everything checks out
                                                next()
                                            }else if (!err && result == false){ // if the password in the jwt is incorrect to the user 
                                                //console.log("user not authentic")
                                                sendinvalid(res)
                                            }else if (err){ // if there is a error
                                                res.status(500).send("error")
                                            }
                                        })  
                                    } // comapares passwords 
                                }else if (error){
                                    res.status(500).send("error")
                                    console.log(error)
                                }   
                            })
                        }else if ((decrypted_jwt.username && decrypted_jwt.username !== req.body.username) || !decrypted_jwt.username ){
                            console.log("jwt isnt the same as username ?")
                            sendinvalid(res)
                        }else if (err){
                            res.status(500).send("error")
                        }
                    } catch (error) { // for case of the jwt not being correct at the undefined values level
                        sendinvalid(res)
                        console.log(error)
                    }
                    
                    
                });
            }catch(error){
                console.log(error)
            }
            
        }
   }catch(error){
        res.status(500).send('Internal server error')
    }

}




module.exports = userauth