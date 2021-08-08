import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import axios from 'axios';
import './App.css';
import Login from './Login/login.js'; // goes to the login page 
import Register from "./register/register.js" 
import Dashboard from "./Dashboard/dashboard.js";
import Footer from "./general_css/footer";
import UdContext from './usercontext/usercontext.js'
import { useContext, useState } from "react";




function App() {
  const [urdata,setUser] = useState({user:null , redirect:false}) // default user info // urdata and setuser from use state are the parametersthat u can use in these routes

  return (
    <div className="App">
      <Router>  
        <Switch>

          <UdContext.Provider value = {{urdata,setUser}}>     

            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path ='/dashboard' component = {Dashboard}/>

          </UdContext.Provider>

          </Switch>
      </Router>
    </div>
  );
}



function Home (){
  return (
    <h1>welcome</h1>
  );
}

export default App;
