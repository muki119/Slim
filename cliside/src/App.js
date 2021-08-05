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
import Footer from "./general_css/footer";




function App() {
  return (
    <div className="App">
      <Router>  
        <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
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
