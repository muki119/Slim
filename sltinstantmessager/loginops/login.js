const Usermodel = require('../userschema/userschema')// register schema 
const express = require('express');
const bcrypt = require('bcrypt');
const AES = require("crypto-js/aes");
const Utf8 = require('crypto-js/enc-utf8')
const loginRoute = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

var RateLimit = require('express-rate-limit');
var loginlimiter = RateLimit({ // 20 logins every 5 mins
  windowMs: 5*60*1000, // 5 minute
  max: 20
});
loginRoute.post('/login',[loginlimiter,jwtauth],async (req,res)=>{ //login middleware -- jauth is the pre-process to this so before doing this process - do jauth 

   // console.log(x+':post request to login ')

    const un =req.body.username// username from request 
    const pass = req.body.password//password from request 

    //console.log(req.body)
    //console.log('^^incomeing body ')
    if (req.body == null){
        console.log(null)
    }
    Usermodel.findOne({$or:[{username:un},{email:un}]},' firstname surname email username password friends date_created verified phonenumber',(error,data)=>{ // data is the found user 
        //console.log(data)
        if (data == null) { // if theres no user matching the description then say that user cannot be found 
            res.clearCookie('SID')
            res.status(200).send({successful:false,login_error:'Invalid username/password'});
        }else if(data !== null){ //otherwise there is a matchin user 

            bcrypt.compare(pass,data.password,async (err, result) =>{ // comapares passwords 
                if (err) { // if an error has arisen
                    console.log('error:'+err)
                }else{
                    if (result == true) { // if the passwords are the same 
                        //jwt creation process -----------
                        
                            // if they choose to be remembered in the client  - as of 15/9/21 this is not the sueres decision - this only operates if the person dosent have a jwt already and has to sign in  
                            // no choice now as of 11/11/21 jwt is now in localstorage

                        var jwtout = await token_create({ // jwt output 
                            username: data.username,
                            password: pass // sets password to the login form password to avoid hashing problems in bcrypt because us cant compare between two hashed passwords
                        }) 
                        //console.log('true')
                       
                        // end +++++++++++++

                        //send data process start ----------

                        //if (jwtout){res.cookie('userauth',jwtout,{httpOnly:true,maxAge:604800000}) }// sends the jwt to the client as a cookie // fixes problem of cookie switching from jwt to undefined where undefined is caused by no remember me in jwt so the jwtout is nothing and as a result the output is nothing - adding a if stamemnt makes sure that if there is somethin in the jwt out then it will send it as a cookie - not just sending it out even with no remember_me == true 
                        res.cookie('SID',jwtout,{maxAge:1209600000,httpOnly:true})// then send the user authentication token (userauth in jwt)
                        res.send({ // sends the data 
                            successful:true,
                            user:{
                                firstname:data.firstname,
                                surname:data.surname,
                                email:data.email,
                                username:data.username,
                                //phonenumber:data.phonenumber, when taken seriously
                                //verified:data.verified, // this will come when i actually take this seriously 
                                date_created:data.date_created,
                                //friends:data.friends // no need for friends now 
                            },
                            redirect:true
                        });
                        
                        //end+++++++++++++++++++++++

                    }else if (result == false ){ // if the passwords are different 
                        if (req.cookies.SID){res.clearCookie("SID")}
                        res.send({successful:false,login_error:'Incorrect username/password'}) //send uncuccesfull and a incorrect messge in json 
                    }
                        
                }
    
            });
    
        }else if (error){// if theres an error then status 500 meaning server side error  
            console.log(error)
            res.status(500).send({successful:false,login_error:'internal server error'})
        } 
    })

    //console.log(req.body.un)
})


async function jwtauth(req,res,next){  // jwt checker  - uses jwt to login 
    try{
        if ((req.cookies.SID) || (req.cookies.SID != null )||(req.cookies.SID != undefined)){// if theres a jwt present it sets that as the username and password then passes it to the main login function 
            //console.log(req.body);// -- thebody that comes in --really for soving problems 
            //console.log ('^^befor body') ;
            var userauth =req.cookies.SID; // gets userauth cookies from the request 
            try{
                const decodedJwt = jwt.verify(userauth,process.env.JWTSK);//decodes jwt
                var decryptedUserdetails = await decryptUd(decodedJwt.UD) // decrypts userdetails in the jwt 
                if (decryptedUserdetails.username && decryptedUserdetails.password){
                    req.body.username = decryptedUserdetails.username;// sets username as the decrypted jwt username 
                    req.body.password = decryptedUserdetails.password;// sets password ass the decrypted jwt password 
                    next() // passes on to main function 
                }else{ // if theres none of them - therefore the cookie is invalid 
                    res.clearCookie('SID')
                    res.status(200).send({auth_error:'Invalid auth',validjwt:false});
                }
            }catch{
                console.log('Jwt verify error')
                res.status(500).send({successful:false,login_error:'internal server error'})
            }
    
        }else{next()} // if token is = null or is just not present then just conitinue with whole process
    }catch(error){
        res.status(500).send({successful:false,login_error:'internal server error'})
    }
}
async function decryptUd (ud){
    try{
        return JSON.parse(AES.decrypt(ud,`${process.env.AES_KEY}`).toString(Utf8))
    }catch(error){
        return error
    }
}
async function token_create(tokenContents){ // make a jwt token  with username and password
    var jwtsk = process.env.JWTSK; // secret key for signing
    var encryptedUserDetails =AES.encrypt(JSON.stringify(tokenContents),`${process.env.AES_KEY}`).toString() // encrypts user details 
    const tokenout = jwt.sign({UD:encryptedUserDetails}, jwtsk, { expiresIn:'14d' }); // encrypts data - dies in 7 days 
    return tokenout // return the token
}
module.exports = loginRoute;