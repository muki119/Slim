import  React,{Suspense,lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import Landing from "./Landing/Landing.js"
import { CircularProgress } from "@mui/material";
const Register = lazy(()=> import("./register/register.js") )
const Login =lazy(()=> import('./Login/login.js')); // goes to the login page 
const Dashboard = lazy(()=> import("./Dashboard/dashboard.js")) // goes to dashboard

function App() {
  return (
    <div className="App">
      <Router>  
        <Switch>

            <Suspense fallback={<Circ/>}>
              <Route exact path="/" component={Landing}/> {/** url routes  */}
              <Route exact path="/login" component={Login}/>
              <Route exact path="/register" component={Register}/>
              <Route exact path ='/dashboard' component = {Dashboard}/>  {/** url/dashboard */}
            </Suspense>

          </Switch>
      </Router>
    </div>
  );
}


function Circ (){
  return(
    <div id = "circ">
      <CircularProgress size= {"3rem"} sx={{color:"#39386e"}}/>
    </div>
  )
}

export default App;
