const regimodel = require('../regiops/registerschem')// register schema 
const express = require('express');
const bcrypt = require('bcrypt');
const logi = express.Router();
const mong = require('mongoose');
const jwt = require('jsonwebtoken');
const dot =require('dotenv').config();
var x = 1
logi.post('/login',jwtauth,async (req,res)=>{ //login middleware -- jauth is the pre-process to this so before doing this process - do jauth 

    console.log(x+':post request to login ')
    console.log(req.headers)
    x = x+ 1 
    const un =req.body.un; // username from request 
    const pass = req.body.pass;//password from request 
    const remember_me  = req.body.remember_me; // do they want their account to be remebered on their client (creates jwt that )

    console.log(req.body)
    //console.log('^^incomeing body ')
    if (req.body == null){
        console.log(null)
    }
    regimodel.findOne({username:un},' firstname surname email username password friends date_created verified phonenumber',(error,data)=>{ // data is the found user 
        //console.log(data)
        if (data == null) { // if theres no user matching the description then say that user cannot be found 
            console.log('user is not found')
            res.status(401).send({login_error:'invalid username/password'});
        }else{ //otherwise there is a matchin user 

            bcrypt.compare(pass,data.password,async (err, result) =>{ // comapares passwords 
                if (err) { // if an error has arisen
                    console.log('error:'+err)
                }else{
                    if (result == true) { // if the passwords are the same 
                        //jwt creation process -----------
                        
                        if (remember_me == true){ // if they choose to be remembered in the client 
                            var jwtout = token_create(obj = {
                                username: data.username,
                                password: pass // sets password to the login form password to avoid hashing problems in bcrypt because us cant compare between two hashed passwords
                            }) 
                            console.log('true')
                        };
                        // end +++++++++++++

                        //send data process start ----------

                        if (jwtout){res.cookie('userauth',jwtout,{httpOnly:true,maxAge:604800000}) }// sends the jwt to the client as a cookie // fixes problem of cookie switching from jwt to undefined where undefined is caused by no remember me in jwt so the jwtout is nothing and as a result the output is nothing - adding a if stamemnt makes sure that if there is somethin in the jwt out then it will send it as a cookie - not just sending it out even with no remember_me == true 
                        
                        res.send({ // sends the data 
                            user:{
                                firstname:data.firstname,
                                surname:data.surname,
                                email:data.email,
                                username:data.username,
                                phonenumber:data.phonenumber,
                                verified:data.verified,
                                date_created:data.date_created,
                                friends:data.friends
                            },
                            redirect:true,
                            jwtout:jwtout, // then send the token  or not 
                                });
                        //end+++++++++++++++++++++++

                    }else if (result == false ){ // if the passwords are different 
                        res.send({login_error:'incorrect username/password'}) //send uncuccesfull and a incorrect messge in json 
                    };
                        
                }
    
            });
    
        }; // if theres an error then status 500 meaning server side error  
    })

    //console.log(req.body.un)
})


function jwtauth(req,res,next){  // jwt checker 
    if ((req.cookies.userauth) || (req.cookies.userauth != null )||(req.cookies.userautuh != undefined)){// if theres a jwt present it sets that as the username and password then passes it to the main login function 
        //console.log(req.body);// -- thebody that comes in --really for soving problems 
        //console.log ('^^befor body') ;
        var userauth =req.cookies.userauth; // gets userauth cookies from the request 

        try{
            const dcjwt = jwt.verify(userauth,process.env.JWTSK);//decodes jwt
            req.body.un = dcjwt.username;// sets username as the decrypted jwt username 
            req.body.pass = dcjwt.password;// sets password ass the decrypted jwt password 

            if(req.body.remember_me){delete req.body.remember_me} // if theres a remember me - just delete it because theres already a jwt token
            //console.log(dcjwt) //solving problems 
            //console.log('^^dcjwt')
            next() // passes on to main function 
        }catch{
            console.log('Jwt verify error')
            next()
        }

    }else{next()} // if token is = null or is just not present then just conitinue with whole process
 
}
function token_create(dtu){ // make a jwt token  with username and password
    var jwtsk = process.env.JWTSK; // secret key 
    const tokenout = jwt.sign(dtu, jwtsk, { expiresIn:'7d' }); // encrypts data - dies in 7 days 
    return tokenout // return the token
  
};
module.exports = logi;