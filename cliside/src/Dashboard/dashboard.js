import React, { useContext, useEffect, useState } from 'react';
import {
    Redirect
} from "react-router-dom";
import UdContext from '../usercontext/usercontext';
import './dashboard.css';
import '../general_css/gcss.css';

function Dashboard (props){
    const {urdata,setUser} = useContext(UdContext) // use this to set user data and pull userdata
    const [logout,setlog] = useState(false)
    document.title = 'Dashboard'
    const dashdata = JSON.parse(localStorage.getItem('UD'))

    function logoutproc(){
        localStorage.clear()
        setlog(true)
    }
    if (dashdata){
        if (dashdata.redirect === false){ // if not authorized 

            return(
                <Redirect push to = '/login' />
            )

        }else if (dashdata.redirect === true ){ // if there is a redirect allowance 
            return(
                <div class = 'dbackground' >
                    <div class='dinbox'>
                        <div class ='topbar'>
                            <span id='barwelcome'>{dashdata.user.firstname} {dashdata.user.surname}</span>
                            <button id='lout'onClick={logoutproc}>Logout</button>
                        </div>
                        <div class = 'chatbar'>
                            <span><span class= 'chatname'>{dashdata.user.firstname} {dashdata.user.surname}</span></span>
                            <span>{dashdata.user.surname}</span>
                        </div>

                    </div>
                </div>
            )

        }
        else if(logout === true) {
            return(
                <Redirect push to = '/login' />
            )

        }  
    }else{
        return(
            <Redirect push to = '/login' />
        )
    }
    

}
 


export default Dashboard