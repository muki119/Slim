import React from 'react';
import ReactDOM from 'react-dom';
import '../general_css/gcss.css'
import './register.css'
import Axios from 'axios'

class Register extends React.Component{
    constructor(props){
        super(props)
        this.state={
            firstname:'',
            surname:'',
            username:'@',
            password:'',
            email:'',
            phonenumber:''
        }
        this.emailmess=''
        this.emailval = null // is email valid
        this.usernamemess = ''
        this.usernamevall = null // is username valid 
        this.handleChange = this.updstate.bind(this);
        this.regiproc = this.regiproc.bind(this)
        this.credtaken = this.credtaken.bind(this)
        document.title = 'Register'
    }
    
    async credtaken(path , data){
        if (path === 'email' ){
            try {
                const axd = await Axios.post('/takencred' , {email:data})
                console.log(axd)
                if (axd.data.taken === false ){ // if theres no match in the database i.e username is not taken 
                    return {out:false}
                }else if (axd.data.taken === true ){ // if there is a match in the data base ie data is taken 
                    return {out:true}
                }  

            } catch (error) {
                
            }
            
    
        }else if (path === 'username'){ // for username side 

            try {
                const axdata = await Axios.post('/takencred' , {username:data})

                console.log(axdata)

                if (axdata.data.taken === false ){ // if username aint taken 

                    this.usernamevall = true // is username valid -true === yes
                    return {out:false}

                    
                }else if (axdata.data.taken === true ){ // if user name is taken

                    this.usernamevall = false //username is not valid
                    return {out:true}

                }   
            } catch (error) {
                
            }
            
        }
    
    }


    
    async updstate(event){
        this.setState({[event.target.name]:event.target.value}) // change the variable name of whoever called this event event.target gets everything of the thing that calls the event 

        if (event.target.name === 'email'){ // email validation 
            const emailtaken  = await this.credtaken('email',this.state.email)
            //console.log(emailtaken)

            if (emailtaken.out === false ){ // if the email is not taken 

                const validemail = validateEmail(this.state.email)
                //console.log(this.emailmess) // valid email checker 
                this.emailmess=null; // remvoe email message
                this.forceUpdate()

                if (validemail === false){

                    this.emailmess='Email is invalid';
                    this.emailval = false
                    this.forceUpdate()

                }else if (validemail === true){

                    this.emailmess='Email is valid';
                    this.emailval = true
                    this.forceUpdate()

                }else{
                    this.emailmess=null;
                    this.forceUpdate()
                }

            }else if (emailtaken.out === true){ // if email is taken
                this.emailmess='Email taken';
                this.forceUpdate()

            }

        }


        if (event.target.name === 'username'){
            const usernametaken = await this.credtaken('username',this.state.username)
            //console.log(this.usernamemess)
            //console.log(usernametaken)

            if (usernametaken.out === true){ // show username is taken

                this.usernamemess = 'Username is taken' 
                this.forceUpdate()

            }else if (usernametaken.out === false){ // show username is not taken

                this.usernamemess = 'Username is valid'
                this.forceUpdate() 

            }
        }
    };

    async regiproc(event){
        //console.log('calling regipro')
        if (this.emailval === true && this.usernamevall === true){
            const streg = await Axios.post('/register' ,{fnm:this.state.firstname,surn:this.state.surname,email:this.state.email ,usrnm:this.state.username,password:this.state.password,pnum:this.state.phonenumber},(err , datas)=>{return datas})
            console.log(streg.data)

        }
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
                            <p1>{this.usernamemess}</p1>
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
                            <button type='submit' onClick={this.regiproc}>Register</button>    
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