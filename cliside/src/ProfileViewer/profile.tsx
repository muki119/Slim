import {Navigate,useSearchParams} from 'react-router-dom'
import React from 'react'
export default function Profile() {
    const [param,setparam] = useSearchParams({})
    const username:string|null = param.get("username")
    return(
    <>
        {username ? 
            <h1>
                {username}
            </h1> 
        : 
            <Navigate to={"/dashboard"}/>
        
        }
  
    </>)
  };
