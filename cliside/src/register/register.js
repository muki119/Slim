import React, { useState,useCallback} from 'react';
import '../general_css/gcss.css'
import './register.css'
import Axios from 'axios'
import debounce  from 'lodash.debounce';



Axios.defaults.withCredentials = true

function Register (){
    const [regidetails,setrd] = useState({
        firstname:'',
        surname:'',
        username:'',
        password:'',
        email:'',
        phonenumber:''
    });
    const [sent,setsent]=useState(false)
    const [successfulcreation,setsc]=useState(false)
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
            if (data === ''){return{out:false}}
            try{
                const axd = await Axios.post(`${process.env.REACT_APP_API_URL}/takencredentials` , {email:data})
                if (axd.data.taken === false ){ // if theres no match in the database i.e username is not taken 
                    return {out:false}
                }else if (axd.data.taken === true ){ 
                    return {out:true}// if there is a match in the data base ie data is taken 
                }

            }catch(err){
                return{out:false}
            }
        
    
        }else if (path === 'username'){ // for username side 

            const tforexp = new RegExp(/([^A-Za-z0-9_.])/)// requirements of a username - no special characters apart from "_" and "."
            var utest = tforexp.test(data) // tests validity to requirements

            if (data === ''){return{out:false}}
            if (utest === false ){ // if there are no matches for unathorised characters

                var atstring = '@'
                var dtbs = atstring.concat(data)

                try {
                    const axdata = await Axios.post(`${process.env.REACT_APP_API_URL}/takencredentials` , {username:dtbs}) // asks if username has been taken 
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
        //eslint-disable-next-line
        const re = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return re.test(email);
    }

    async function guimessnval(event){ 
        if (event.target.name === 'email'){ // email validation 
            const emailtaken  = await credtaken('email',event.target.value) // is email taken?
            if (emailtaken.out === false ){ // if the email is not taken 
                const validemail = validateEmail(event.target.value) // validity checker 
                setmessvall({...messval,emailmess:''})
                if (validemail === false){
                    setmessvall({...messval,emailmess:'Invalid',emailval:false})
                    document.getElementById('emailmess').style = "color: rgb(90, 15, 15);";
                }else if (validemail === true){
                    setmessvall({...messval,emailmess:'Valid',emailval:true})
                    document.getElementById('emailmess').style = "color:green";
                }else{
                    setmessvall({...messval,emailmess:''})
                }
            }else if (emailtaken.out === true){ // if email is taken
                setmessvall({...messval,emailmess:'Taken'})
                document.getElementById('emailmess').style = "color: rgb(90, 15, 15);";
            }
        }
        if (event.target.name === 'username'){
            const usernametaken = await credtaken('username',event.target.value)
            if (usernametaken.out === true){ // show username is taken
                setmessvall({...messval,usernamemess:'Username is taken',usernamevall:false})
                document.getElementById('usernamemess').style = "color: rgb(90, 15, 15);";
            }else if (usernametaken.out === false){ // show username is not taken
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
        setrd({...regidetails,[event.target.name]:event.target.value.trim()})
        // change the variable name of whoever called this event event.target gets everything of the thing that calls the event   
        debcall(event) // debounce function call 
    }

    async function regiproc(){ // register process
        if (messval.emailval === true && messval.usernamevall === true && regidetails.password.length >1){
            var atc = "@"
            var new_con = atc.concat(regidetails.username.trim())
            const streg = await Axios.post(`${process.env.REACT_APP_API_URL}/register` ,{fnm:regidetails.firstname,surn:regidetails.surname,email:regidetails.email ,usrnm:new_con,password:regidetails.password,pnum:regidetails.phonenumber})
            var success = streg.data.success
            if(success && success === true){
                setsent(true)
                setsc(success)
            }
        }
    }
    const debrp = useCallback(debounce(()=>{regiproc()},700),[regidetails]) //array should be things that are going to be used in debounced function
    return(
        <div className='logbackground'>
            <div className='maincontainer'> 
            {sent === false &&
                <div className = 'Form_schem'>
                    
                    <span><h1>Create an account</h1></span>
                    <span>
                        <label htmlFor='first_name'>Firstname</label>
                        <input id ='first_name' placeholder='Forename' type='text' value = {regidetails.firstname} onChange = { handleChange} name = 'firstname' required/>
                    </span>
                    <span>
                        <label htmlFor='sur_name'>Surname</label>
                        <input id ='sur_name' placeholder='Surname'type='text' value = {regidetails.surname} onChange = { handleChange} name = 'surname' required/>
                    </span>
                    <span className ='usernamewpfx' >
                        <span className ='usernameprt'>
                            <label htmlFor='Username'>Username</label>
                            <span id ='pfxcontainer'>
                                <span className = 'pfx'>@</span>
                                <input id = 'Username' value = {regidetails.username} type='text' placeholder = 'Username' onChange = {handleChange} name = 'username' required/>
                            </span>
                            {messval.usernamemess.length >0 && <p id='usernamemess'>{messval.usernamemess}</p>}
                        </span>
                    </span>
                    <span> 
                        <label htmlFor='Password'>Password</label>
                        <input id = 'Password' type='password' value = {regidetails.password}  placeholder = 'Password' onChange = {handleChange} name = 'password' required/>
                    </span>
                    <span>
                        <label htmlFor='email'>Email</label>
                        <input id ='email' type = 'email' placeholder='Email' autoComplete='email'  value = {regidetails.email} onChange = {handleChange} name ='email' maxLength = '320' required/>
                        {messval.emailmess.length > 0 &&<p id='emailmess'>{messval.emailmess}</p>}
                    </span>
                    <span>
                        <label htmlFor='phonenumber'>Phonenumber</label>
                        <input id ='phonenumber' placeholder='Phonenumber'type='text' value = {regidetails.phonenumber} onChange = {handleChange} name = 'phonenumber'/>
                    </span>
        
                    <span>
                        <button type='submit' onClick={debrp}>Register</button>    
                    </span>
                    <span id = 'tctxt'>
                        <p>By clicking Register you are agreeing to the <a href= 'https://www.google.com'>Terms and Conditions</a></p>
                    </span>
                    <span className = 'logbtn'>
                        <span>Already have an account?<a href='/login'>Login</a></span>
                    </span>

                </div>
            }
            {sent === true &&
               <div className = 'container'>
                   {successfulcreation === true && 
                        <div className='indicationcontainer Form_schem'>
                            <span><p>Registration complete!</p></span>
                            <span><button onClick={()=>{document.location='/login'}}>Proceed to Login.</button></span>
                        </div>
                   }

                   {successfulcreation===false &&
                        <div className='indicationcontainer Form_schem'>
                            <span><p>Registration Unsuccessful</p></span>
                            <span><button onClick={()=>{setsent(false);setsc(false)}}>Click to try again.</button></span>
                        </div>
                   }

               </div>
            }
            </div>
        </div>


    )


}
export default Register