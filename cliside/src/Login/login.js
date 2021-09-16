import React, { useEffect, useState } from 'react';
import Axios from 'axios'
import './login.css'
import '../general_css/gcss.css'
import {
    Redirect
  } from "react-router-dom";
import UdContext from '../usercontext/usercontext';
import { createContext, useContext } from "react";


function Login (){
    const [logindetails,setdetails] = useState({un:'',pass:'',remember_me:true}) //function component equivalent of this.state  // used to get login details
    const [redirect ,setredirect ] = useState(false) // redirect state // allow redirect to dashboard?
    const {urdata ,setUser} = useContext(UdContext) // use this to set userdata to use any where
    document.title = 'Login'
    Axios.defaults.withCredentials = true
    
    function handleChange (event){
        setdetails({...logindetails ,[event.target.name]: event.target.value}) // changes 
        console.log(logindetails)
        console.log('somewhat works')
    }

    async function loginproce(){
        try {
            const userdata = await Axios.post('http://localhost:25565/login',logindetails,{headers: {'Content-Type': 'application/json'}})
            if (userdata.data.redirect === true){
                setredirect(userdata.data.redirect);
                setUser({user:userdata.data.user,redirect:userdata.data.redirect}) // sets context to userdata from the redirect
            }  
        } catch (error) {
            throw 'Error in Attempt to send';
        }
        
    }
    async function onloadlogin (){
        try {
            const prelog = await Axios.post('http://localhost:25565/login',null,{headers: {'Content-Type': 'application/json'}})
            if (prelog.data.redirect === true){
                setredirect(prelog.data.redirect);
                setUser({user:prelog.data.user,redirect:prelog.data.redirect}) // sets context to userdata from the redirect
            }
        } catch (error) {
            throw 'Error in attempt to send oll';
        }
        
    }

    useEffect(()=>{
        onloadlogin()
    },[])

    if (redirect === true) {
        return(<Redirect push to = '/dashboard' />)
    }else{
        return(
            <div class = 'logbackground'>
                <div class = 'maincontainer'>
                    <div class ='Form_schem'>
                        <span>
                            <label for='Username'>Username</label>
                            <input value = {logindetails.un} type='text' name = 'un' id = 'Username'placeholder = 'Username'  onChange={handleChange}/>
                        </span>
                        <span>
                            <label for= 'Password'>Password</label>
                            <input value = {logindetails.pass} name = 'pass' id = 'Password'placeholder = 'Password' type = 'password' onChange={handleChange}/>
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