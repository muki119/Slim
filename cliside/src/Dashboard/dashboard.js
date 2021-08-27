import React, { useContext } from 'react';
import {
    BrowserRouter as Router,
    Redirect
} from "react-router-dom";
import UdContext from '../usercontext/usercontext';


function Dashboard (props){
    const {urdata} = useContext(UdContext) // use this to set user data and pull userdata
    document.title = 'Dashboard'
    if (urdata.redirect === false){ // if not authenticated 

        return(
            <Redirect push to = '/login' />
        )

    }else if (urdata.redirect=== true){ // if there is a redirect allowance 
        return(
            <div>
                <a href = '/register'>register</a>
                <p>{JSON.stringify(urdata.user)}</p>
            </div>
        )

    }
    

}
 


export default Dashboard