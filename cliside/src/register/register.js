import React from 'react';
import ReactDOM from 'react-dom';
import '../general_css/gcss.css'
import './register.css'
import footer from '../general_css/footer';
import Axios from 'axios'

class Register extends React.Component{
    constructor(props){
        super(props)
        this.state={
            firstname:'',
            surname:'',
            username:'',
            password:'',
            email:'',
            phonenumber:''
        }
        this.emailmess=''
        this.handleChange = this.updstate.bind(this);
        this.regiproc = this.regiproc.bind(this)

    }


    
    updstate(event){
        this.setState({[event.target.name]:event.target.value}) // change the variable name of whoever called this event event.target gets everything of the thing that calls the event 

        if (event.target.name == 'email'){ // email validation 
            var carp = validateEmail(this.state.email)
            if (carp == false){
                this.emailmess='Email is invalid';
                this.forceUpdate()
            }else if (carp = true){
                this.emailmess=null;
                this.forceUpdate()
            }else{
                this.emailmess=null;
                this.forceUpdate()
            }

        }
    };

    regiproc(event){
        console.log(this.state)
    };
    render(){
        return(
            <div class='logbackground'>
                <div class='maincontainer'> 
                    <div class = 'Form_schem'>
                        
                        <span><h1>Create an account</h1></span>
                        <span>
                            <label for='first_name'>Firstname</label>
                            <input id ='first_name' placeholder='Forename' type='text' value = {this.state.firstname} onChange = { this.handleChange} name = 'firstname' required/>
                        </span>
                        <span>
                            <label for='sur_name'>Surname</label>
                            <input id ='sur_name' placeholder='Surname'type='text' value = {this.state.surname} onChange = { this.handleChange} name = 'surname' required/>
                        </span>
                        <span>
                            <label for='Username'>Username</label>
                            <input id = 'Username' value = {this.state.username} type='text' placeholder = 'Username' onChange = {this.handleChange} name = 'username' required/>
                        </span>
                        <span> 
                            <label for='Password'>Password</label>
                            <input id = 'Password' type='password' value = {this.state.password}  placeholder = 'Password' onChange = { this.handleChange} name = 'password' required/>
                        </span>
                        <span>
                            <label for='email'>Email</label>
                            <input id ='email' type = 'email' placeholder='Email' autoComplete='email'  value = {this.state.email} onChange = {this.handleChange} name ='email' maxLength = '320' required/>
                            <p1 id='emailmess'>{this.emailmess}</p1>
                        </span>
                        <span>
                            <label for='phonenumber'>Phonenumber</label>
                            <input id ='phonenumber' placeholder='Phonenumber'type='text' value = {this.state.phonenumber} onChange = {this.handleChange} name = 'phonenumber'/>
                        </span>
            
                        <span>
                            <button type='submit'>Register</button>    
                        </span>
                        <span id = 'tctxt'>
                            <p1>By clicking Register you are agreeing to the <a href= '#'>Terms and Conditions</a></p1>
                        </span>
                        <span class = 'logbtn'>
                            <span>Already have an account?<a href='/login'>Login</a></span>
                        </span>
                    </div>
                </div>
            </div>


        )
    }

}


function validateEmail(email) { // email validation process
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default Register