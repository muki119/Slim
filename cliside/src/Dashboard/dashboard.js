import React, { useContext } from 'react';
import ReactDOM, { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import UdContext from '../usercontext/usercontext';

function Dashboard (props){
    const {urdata,setUser} = useContext(UdContext) // use this to set user data and pull userdata
   
    if (urdata.redirect == false){ // if not authenticated 

        return(
            <Redirect push to = '/login' />
        )

    }else if (urdata.redirect== true){ // if there is a redirect allowance 
        return(
                <p>{JSON.stringify(urdata.user)}</p>
            )

    }
    

}
 


export default Dashboard