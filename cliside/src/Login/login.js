import React, { useEffect, useState } from 'react';
import Axios from 'axios'
import './login.css'
import '../general_css/gcss.css'
import {
    Redirect
  } from "react-router-dom";
import UdContext from '../usercontext/usercontext';
import { useContext } from "react";


function Login (){
    const [logindetails,setdetails] = useState({un:'',pass:'',remember_me:true}) //function component equivalent of this.state  // used to get login details
    const [redirect ,setredirect ] = useState(false) // redirect state // allow redirect to dashboard?
    const {urdata ,setUser} = useContext(UdContext) // use this to set userdata to use any where
    const [erm,seterm] = useState(null) // error message if incorrect login
    document.title = 'Login'
    Axios.defaults.withCredentials = true
    
    function handleChange (event){
        setdetails({...logindetails ,[event.target.name]: event.target.value}) // changes 
        //console.log(logindetails)
        //console.log('somewhat works')
    }

    async function loginproce(){
        try {
            const userdata = await Axios.post(`${process.env.REACT_APP_API_URL}/login`,logindetails)
            //console.log(userdata)
            if (userdata.data.redirect === true){
                
                var ud = JSON.stringify({user:userdata.data.user,redirect:userdata.data.redirect})
                localStorage.setItem('UD',ud)// user data
                localStorage.setItem('Uat',userdata.data.uat) // jwt 
                setredirect(userdata.data.redirect);
 
            } else if (userdata.data.login_error!== null){

                seterm(userdata.data.login_error)
               // console.log(userdata.data.login_error)
                
            }
        } catch (error) {
            console.log(error)
            throw 'Error in Attempt to send';
            
        }
        
    }
    async function onloadlogin (){
        var uat = localStorage.getItem('Uat') // user authentication token
        if (uat){
            var sentuat = {userauth:uat}
            try {
                const usdata = await Axios.post(`${process.env.REACT_APP_API_URL}/login`,sentuat)
                if (usdata.data.redirect === true){

                    localStorage.setItem('UD',JSON.stringify({user:usdata.data.user,redirect:usdata.data.redirect}))
                    localStorage.setItem('Uat',usdata.data.uat)
                    setredirect(usdata.data.redirect);
                    
                } else if (usdata.data.login_error!== null){ // if there is a error message found 
                    localStorage.clear()
                }
            } catch (error) {
                console.log(error)
                throw 'Error in Attempt to send'; 
            }
        }
        
        // check if jwt in local storrage
        // send to server 
        // if ok then redirect and change user data local storage (UD)
        
    }

    useEffect(()=>{
        onloadlogin()
    },[])

    function enterlp (e){
        if (e.key == 'Enter'){
            loginproce()
        }
    }

    if (redirect === true) {
        return(<Redirect push to = '/dashboard' />)
    }else{
        return(
            <div class = 'logbackground'>
                <div class = 'maincontainer'>
                    <div class ='Form_schem'>
                        <span>
                            {erm !== null && <h2>{erm}</h2>}
                        </span>
                        <span>
                            <label htmlFor='Username'>Username</label>
                            <input value = {logindetails.un} type='text' name = 'un' id = 'Username'placeholder = 'Username'  onChange={handleChange}/>
                        </span>
                        <span>
                            <label htmlFor= 'Password'>Password</label>
                            <input value = {logindetails.pass} name = 'pass' id = 'Password'placeholder = 'Password' type = 'password' onChange={handleChange} onKeyPress={enterlp} />
                        </span>
                        <span>
                            <button id = 'login_button'onClick = {loginproce}>Login</button>
                        </span>
                        <span class = 'fn'>
                            <span><a href='/login'>Forgotten Your Password?</a></span>
                            <span class = 'regilink'>Need An account? <a href ='/register'>Register</a></span>
                        </span>
                    </div>
                </div> 
                
            </div>
        )
    }
    
}








export default Login