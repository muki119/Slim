import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios'
import './login.css'
import '../general_css/gcss.css'
import Footer from '../general_css/footer';


class Login extends React.Component{

    constructor(props){
        super(props)
        this.state = { // their version of constructor
            un:'',
            pass:'',
            remember_me:false
        }
        this.body = [];
        this.bodyout = this.body.forEach((val)=>{
            <h1 component ={val} />
        })
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.updstate.bind(this);
        this.loginproce= this.loginproc.bind(this);
    }

    async handleSubmit(event){
        
    }
    updstate(event){
        this.setState({[event.target.name]:event.target.value}) // change the variable name of whoever called this event event.target gets everything of the thing that calls the event 
        console.log(this.state)
    };
    async loginproc(event){
        console.log(this.state)
        var log = await Axios.post('/login',this.state,{})
        console.log(log.data)
        if (log.data.redirect == true ){
            this.body.push(log.data.user.username , log.data.user.email)
            console.log(this.bodyout)
            this.forceUpdate()
        }

    
    };
    render(){
        return(
            <div class = 'logbackground'>
                <div class = 'maincontainer'>
                    <div class ='Form_schem'>
                        <span>
                            <label for='Username'>Username</label>
                            <input value = {this.state.un} type='text' name = 'un' id = 'Username'placeholder = 'Username'  onChange={this.handleChange}/>
                        </span>
                        <span>
                            <label for= 'Password'>Password</label>
                            <input value = {this.state.pass} name = 'pass' id = 'Password'placeholder = 'Password' type = 'password' onChange={this.handleChange}/>
                        </span>
                        <span>
                            <span class = 'rme'>
                                <label for='remeber_me'>Remember me ? </label>
                                <input value = {this.state.remember_me}name = 'remember_me'id='remember_me'type='checkbox' onChange={this.handleChange}/>
                            </span>
                        </span>
                        <span>
                            <button id = 'login_button'onClick = {this.loginproce}>Login</button>
                        </span>
                        <span class = 'fn'>
                            <span><a href='/login'>Forgotten Your Password?</a></span>
                            <span class = 'regilink'>Need An account? <a href ='/register'>Register</a></span>
                        </span>
                    </div>
                </div>   
            </div>
            
        )

    };
}




export default Login