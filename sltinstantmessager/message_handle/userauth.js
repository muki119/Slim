const Usermodel = require('../userschema/userschema')// register schema 
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const AES = require("crypto-js/aes");
const Utf8 = require('crypto-js/enc-utf8')


function sendinvalid(res){ // function for sending errors to client 
    res.status(200).send({auth_error:'Invalid auth',validjwt:false}); // tells client that jwt isnt authentic.
}
function decryptuserdetails(decryptedJwt){ // decrypts userdeatails in token 
    return JSON.parse(AES.decrypt(decryptedJwt.UD,`${process.env.AES_KEY}`).toString(Utf8)) // decryption 
}

function userauth (req,res,next){// this checks the jwt sent alongside to verify that what is sent is the user // this process should also be rate limited as the login one and register 
   try{
        if (!req.cookies.SID){ // if no cookie 
            sendinvalid(res) // send error 
        }else if (req.cookies.SID){
            const uat = req.cookies.SID// Uat stands for user authentication/authorization token 
            try{
                jwt.verify(uat,process.env.JWTSK,(err,decodedJwt)=>{
                    try {
                        var decryptedJwt = decryptuserdetails(decodedJwt)  // decrypts the ud
                        if ( decryptedJwt.username && decryptedJwt.username === req.body.username){
                            Usermodel.findOne({username:decryptedJwt.username},'password',(error,data)=>{ // data is the found user 
                                if (!error){
                                    if (data == null) { // if theres no user matching the description then say that user cannot be found 
                                        sendinvalid(res)
                                    }else{ //otherwise there is a matching user 
                                        bcrypt.compare(decryptedJwt.password,data.password,async (err, result) =>{ // compares password with one in datatabase
                                            if (!err && result == true){  // if everything checks out
                                                next()
                                            }else if (!err && result == false){ // if the password in the jwt is incorrect to the user then the user isnt authentic 
                                                sendinvalid(res) // send the error to the client 
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
                        }else if ((decryptedJwt.username && decryptedJwt.username !== req.body.username) || !decryptedJwt.username ){ // if jwt username isnt the same as the username sent 
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