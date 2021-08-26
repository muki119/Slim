import React, { useState,useCallback} from 'react';
import '../general_css/gcss.css'
import './register.css'
import Axios from 'axios'
import {debounce}  from 'lodash';

function Register (){
    const [regidetails,setrd] = useState({
        firstname:'',
        surname:'',
        username:'',
        password:'',
        email:'',
        phonenumber:''
    });

    const [messval,setmessvall] = useState({
        emailmess:'',
        emailval :null,// is email valid true = yes
        usernamemess :'',
        usernamevall :null// is username valid true = yes 
    });

    document.title = 'Register';

    
    async function credtaken(path , data){ // check if user credentials are already taken 
        //console.log(data)
        
        if (path === 'email'){
            if (data === ''){return{out:false}};
            try{
                console.log(data[0])
                const axd = await Axios.post('/takencred' , {email:data})
                if (axd.data.taken === false ){ // if theres no match in the database i.e username is not taken 
                    return {out:false}
                }else if (axd.data.taken === true ){ 
                    return {out:true}// if there is a match in the data base ie data is taken 
                }

            }catch(err){
                return{out:false}
            }
        
    
        }else if (path === 'username'){ // for username side 

            const tforexp = /([^A-Za-z0-9])/ // test if @ is in the username
            var utest = tforexp.test(data)

            if (data === ''){return{out:false}}
            if (utest === false ){ // if there are no matches for unathorised characters
                var atstring = '@'
                var dtbs = atstring.concat(data)
                try {
                    const axdata = await Axios.post('/takencred' , {username:dtbs}) // cancel source token for performance optimisaztion
                    //console.log(axdata)
                    if (axdata.data.taken === false ){ // if username aint taken 
                        //this.usernamevall = true // is username valid -true === yes
                        return {out:false}
                        
                    }else if (axdata.data.taken === true ){ // if user name is taken
                        //this.usernamevall = false //username is not valid
                        setmessvall({...messval,usernamevall:false})
                        return {out:true}

                    }   
                    
                } catch (error) {
                    return {out:true}
                }
            }else if (utest === true){
                return{out:'unctuoc'}
            }
            
            
        }
        
    
    }

    function validateEmail(email) { // email validation process
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    async function guimessnval(event){ 
        if (event.target.name === 'email'){ // email validation 

            const emailtaken  = await credtaken('email',event.target.value) // is email taken?
            //console.table(regidetails.email,emailtaken.out)

            if (emailtaken.out === false ){ // if the email is not taken 

                const validemail = validateEmail(event.target.value)
                //console.log(this.emailmess) // valid email checker 
                //this.emailmess=null; // remvoe email message
                setmessvall({...messval,emailmess:''})
                

                if (validemail === false){
                    //this.emailmess='Email is invalid';
                    //this.emailval = false
                    //this.forceUpdate()
                    
                    setmessvall({...messval,emailmess:'Invalid',emailval:false})
                    document.getElementById('emailmess').style = "color: rgb(90, 15, 15);";

                }else if (validemail === true){
                    // this.emailmess='Email is valid';
                    //this.emailval = true
                    //this.forceUpdate()
                    setmessvall({...messval,emailmess:'Valid',emailval:true})
                    document.getElementById('emailmess').style = "color:green";
                }else{
                    //this.emailmess=null;
                    //this.forceUpdate()
                    setmessvall({...messval,emailmess:''})
                }

            }else if (emailtaken.out === true){ // if email is taken
                //this.emailmess='Email taken';
                //this.forceUpdate()

                setmessvall({...messval,emailmess:'Taken'})
                document.getElementById('emailmess').style = "color: rgb(90, 15, 15);";
            }

        }

        if (event.target.name === 'username'){
            const usernametaken = await credtaken('username',event.target.value)
            //console.log(this.usernamemess)
            console.log('username')
            console.log(usernametaken)

            if (usernametaken.out === true){ // show username is taken

                //this.usernamemess = 'Username is taken' 
                //this.forceUpdate()

                setmessvall({...messval,usernamemess:'Username is taken',usernamevall:false})
                document.getElementById('usernamemess').style = "color: rgb(90, 15, 15);";

            }else if (usernametaken.out === false){ // show username is not taken

                //this.usernamemess = 'Username is valid'
                //this.forceUpdate() 

                setmessvall({...messval,usernamemess:'Username is valid',usernamevall:true})
                document.getElementById('usernamemess').style = "color:green";

            }else if (usernametaken.out === 'unctuoc'){
                setmessvall({...messval,usernamemess:'Username Contains invalid characters',usernamevall:false})
                document.getElementById('usernamemess').style = "color: rgb(90, 15, 15);";
            }
        }
        
    }

    const debcall =useCallback(debounce((event)=>{guimessnval(event)},700),[messval])// debounce calls to guimessnvall - array are dependencies

    async function handleChange (event){ //hood for debouncee
        setrd({...regidetails,[event.target.name]:event.target.value})
        // change the variable name of whoever called this event event.target gets everything of the thing that calls the event 
        //console.log(regidetails)   
        debcall(event) // debounce function call 
        
        //guimessnval(event) 
        
    };

    async function regiproc(){ // register process
        //console.log('calling regipro')
        if (messval.emailval === true && messval.usernamevall === true){
            const streg = await Axios.post('/register' ,{fnm:regidetails.firstname,surn:regidetails.surname,email:regidetails.email ,usrnm:regidetails.username,password:regidetails.password,pnum:regidetails.phonenumber})
            console.log(streg.data)

        }
    };

    return(
        <div class='logbackground'>
            <div class='maincontainer'> 
                <div class = 'Form_schem'>
                    
                    <span><h1>Create an account</h1></span>
                    <span>
                        <label for='first_name'>Firstname</label>
                        <input id ='first_name' placeholder='Forename' type='text' value = {regidetails.firstname} onChange = { handleChange} name = 'firstname' required/>
                    </span>
                    <span>
                        <label for='sur_name'>Surname</label>
                        <input id ='sur_name' placeholder='Surname'type='text' value = {regidetails.surname} onChange = { handleChange} name = 'surname' required/>
                    </span>
                    <span class ='usernamewpfx' >
                        <span class ='usernameprt'>
                            <label for='Username'>Username</label>
                            <span id ='pfxcontainer'>
                                <span class = 'pfx'>@</span>
                                <input id = 'Username' value = {regidetails.username} type='text' placeholder = 'Username' onChange = {handleChange} name = 'username' required/>
                            </span>
                            {messval.usernamemess.length >0 && <p id='usernamemess'>{messval.usernamemess}</p>}
                        </span>
                    </span>
                    <span> 
                        <label for='Password'>Password</label>
                        <input id = 'Password' type='password' value = {regidetails.password}  placeholder = 'Password' onChange = { handleChange} name = 'password' required/>
                    </span>
                    <span>
                        <label for='email'>Email</label>
                        <input id ='email' type = 'email' placeholder='Email' autoComplete='email'  value = {regidetails.email} onChange = {handleChange} name ='email' maxLength = '320' required/>
                        {messval.emailmess.length > 0 &&<p id='emailmess'>{messval.emailmess}</p>}
                    </span>
                    <span>
                        <label for='phonenumber'>Phonenumber</label>
                        <input id ='phonenumber' placeholder='Phonenumber'type='text' value = {regidetails.phonenumber} onChange = {handleChange} name = 'phonenumber'/>
                    </span>
        
                    <span>
                        <button type='submit' onClick={regiproc}>Register</button>    
                    </span>
                    <span id = 'tctxt'>
                        <p>By clicking Register you are agreeing to the <a href= '#'>Terms and Conditions</a></p>
                    </span>
                    <span class = 'logbtn'>
                        <span>Already have an account?<a href='/login'>Login</a></span>
                    </span>

                </div>
            </div>
        </div>


    )


}
export default Register