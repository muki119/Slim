import React, { useEffect, useState } from 'react';
import Axios from 'axios'
import './login.css'
import '../general_css/gcss.css'
import {
    Navigate as Redirect
} from "react-router-dom";
Axios.defaults.withCredentials = true
document.title = 'Login'


function Login (){
    
    const [logindetails,setdetails] = useState({username:'',password:'',remember_me:true}) //function component equivalent of this.state  // used to get login details
    const [redirect ,setredirect ] = useState(false) // redirect state // allow redirect to dashboard?
    const [errorMessage,seterm] = useState(null) // error message if incorrect login
    
    
    function handleChange (event:any){
        setdetails({...logindetails ,[event.target.name]: event.target.value}) // changes 
    }

    async function loginproce(){
        try {
            const userdata = await Axios.post(`${import.meta.env.VITE_APP_API_URL}/login`,logindetails) // send details to server and asign response as variable 
            if (userdata.data.redirect === true){ // if successfull and should go to dashboard 
                var userDetails = JSON.stringify({user:userdata.data.user,redirect:userdata.data.redirect}) 
                localStorage.setItem('UD',userDetails)// user data // save user info  in local storage 
                setredirect(userdata.data.redirect); // redirectr to dashboard 
 
            } else if (userdata.data.successful === false){
                seterm(userdata.data.login_error) // display error message 
            }
        } catch (error) {
            console.log(error) 
        }
        
    }
    async function onloadlogin (){ // This is done automatically once you go onto the login page 
            try {
                const usdata = await Axios.post(`${import.meta.env.VITE_APP_API_URL}/login`,null) // sends cookie to server and asigns response as variable 
                if (usdata.data.redirect === true){ // if can go to dashboard 
                    localStorage.setItem('UD',JSON.stringify({user:usdata.data.user,redirect:usdata.data.redirect})) // save user data in localstorage
                    setredirect(usdata.data.redirect); //redirect to dashboard 
                } else if (usdata.data.successful === false){ // if token was false -
                    localStorage.clear() // clear any data 
                }
            } catch (error) {
            }
    }

    useEffect(()=>{
        onloadlogin() // on first render- call the function 
    },[]) // empty brackets means that its to only happen once 

    function enterlp (e:any){ // listens for enter button 
        if (e.key === 'Enter'){
            loginproce()
        }
    }

    if (redirect === true) {
        return(<Redirect to = '/dashboard' />)
    }else{
        return(
            <div className = 'logbackground'>
                <div className = 'maincontainer'>
                    <form className ='Form_schem'>
                        <span>
                            {errorMessage !== null && <h2>{errorMessage}</h2>}
                        </span>
                        <span>
                            <label htmlFor='Username'>Username</label>
                            <input value = {logindetails.username} type='text' name = 'username' id = 'Username'placeholder = 'Username or Email'  onChange={handleChange}/>
                        </span>
                        <span>
                            <label htmlFor= 'Password'>Password</label>
                            <input value = {logindetails.password} name = 'password' id = 'Password'placeholder = 'Password' type = 'password' onChange={handleChange} onKeyPress={enterlp} />
                        </span>
                        <span>
                            <button id = 'login_button'onClick = {(e)=> {e.preventDefault();loginproce()}}>Login</button>
                        </span>
                        <span className = 'fn'>
                            <span><a href='/login'>Forgotten Your Password?</a></span>
                            <span className = 'regilink'>Need An account? <a href ='/register'>Register</a></span>
                        </span>
                    </form>
                </div> 
                
            </div>
        )
    }
    
}








export default Login