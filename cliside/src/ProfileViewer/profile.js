import {Navigate,useSearchParams} from 'react-router-dom'
export default function Profile() {
    const [param,setparam] = useSearchParams({})
    const username = param.get("username")
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
