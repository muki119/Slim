import  React,{Suspense,lazy, useState,useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Landing from "./Landing/Landing.js"
import { CircularProgress } from "@mui/material";
import {ThemeContext} from "./ThemeContext";
const Register = lazy(()=> import("./register/register.js") )
const Login =lazy(()=> import('./Login/login')); // goes to the login page 
const Dashboard = lazy(()=>import("./Dashboard/dashboard")); // goes to dashboard
const Profile = lazy(()=>import("./ProfileViewer/profile"));

function App() {
  const [currentTheme,setCurrentTheme] = useState<any>("light")
  const setcurrentThemeFunc:any= ()=>{
    if (currentTheme === null ){ // if its device choice - go to light mode
      setCurrentTheme("light")
    }else if(currentTheme === "light"){ // if its light mode go to dark mode
      setCurrentTheme("dark")
    }else{ // if its darkmode - go to device choice 
      setCurrentTheme(null)
    }
  }
  useEffect(()=>{
    {localStorage.getItem("colorScheme")?setCurrentTheme(localStorage.getItem("colorScheme")):setCurrentTheme("light")}
  },[])
  useEffect(()=>{
    document.body.setAttribute("color-scheme",currentTheme)
    localStorage.setItem('colorScheme',currentTheme)
  },[currentTheme])
  return (
    <>
    <Router>
      <ThemeContext.Provider value={{currentTheme,setcurrentThemeFunc}}>
        <Suspense fallback={<Circ/>}>
          <Routes>  
            <Route  path="/" element={<Landing/>}/> {/** url routes  */}
            <Route  path="/login" element={<Login/>}/>
            <Route  path="/register" element={<Register/>}/>
            <Route  path ='/dashboard' element = {<Dashboard/>}/>  {/** url/dashboard */}
            <Route  path ='/profile' element={<Profile/>}/>
            <Route path="*" element={<Fof/>}/> {/*404 error for any unknown ones */}
          </Routes>
        </Suspense>
      </ThemeContext.Provider>
    </Router>
    </>
  );
}


function Fof () { 

  return(
    <>
    <h1>
      404 Requested resource cannot be found.
    </h1>
    </>
  )
 }

function Circ (){
  return(
    <div id = "circ">
      <CircularProgress size= {"3rem"} sx={{color:"#39386e"}}/>
    </div>
  )
}

export default App;
