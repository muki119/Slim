import React, { useContext, useEffect } from 'react';
import {
    Redirect
} from "react-router-dom";
import UdContext from '../usercontext/usercontext';
import './dashboard.css';
import '../general_css/gcss.css';

function Dashboard (props){
    const {urdata,setUser} = useContext(UdContext) // use this to set user data and pull userdata
    document.title = 'Dashboard'
    const dashdata = JSON.parse(localStorage.getItem('UD'))
    
    if (dashdata.redirect === false){ // if not authorized 

        return(
            <Redirect push to = '/login' />
        )

    }else if (dashdata.redirect === true ){ // if there is a redirect allowance 
        return(
            <div class = 'logbackground dbackground' >
                <div class='dinbox'>
                    <div class ='topbar'>
                        <span id='barwelcome'>{dashdata.user.firstname} {dashdata.user.surname}</span>
                    </div>
                    <div class = 'chatbar'>
                        <span>{dashdata.user.firstname}</span>
                        <span>{dashdata.user.surname}</span>
                    </div>

                    <a href = '/register'>register</a>
                    <p>{JSON.stringify(dashdata.user)}</p>

                </div>
            </div>
        )

    }

}
 


export default Dashboard