import React from 'react';

export default function RegisterForm({sent, registerDetails, handleChange, messval, debrp, successfulcreation, setsent, setsc}) {
    return <div className='logbackground'>
        <div className='maincontainer'>
            {sent === false &&
                <div className='Form_schem'>

                    <span><h1>Create an account</h1></span>
                    <span>
                        <label htmlFor='first_name'>Firstname</label>
                        <input id='first_name' placeholder='Forename' type='text' value={registerDetails.firstname} onChange={handleChange} name='firstname' required />
                    </span>
                    <span>
                        <label htmlFor='sur_name'>Surname</label>
                        <input id='sur_name' placeholder='Surname' type='text' value={registerDetails.surname} onChange={handleChange} name='surname' required />
                    </span>
                    <span className='usernamewpfx'>
                        <span className='usernameprt'>
                            <label htmlFor='Username'>Username</label>
                            <span id='pfxcontainer'>
                                <span className='pfx'>@</span>
                                <input id='Username' value={registerDetails.username} type='text' placeholder='Username' onChange={handleChange} name='username' required />
                            </span>
                            {messval.usernamemess.length > 0 && <p id='usernamemess'>{messval.usernamemess}</p>}
                        </span>
                    </span>
                    <span>
                        <label htmlFor='Password'>Password</label>
                        <input id='Password' type='password' value={registerDetails.password} placeholder='Password' onChange={handleChange} name='password' required />
                    </span>
                    <span>
                        <label htmlFor='email'>Email</label>
                        <input id='email' type='email' placeholder='Email' autoComplete='email' value={registerDetails.email} onChange={handleChange} name='email' maxLength='320' required />
                        {messval.emailmess.length > 0 && <p id='emailmess'>{messval.emailmess}</p>}
                    </span>
                    <span>
                        <label htmlFor='phonenumber'>Phonenumber</label>
                        <input id='phonenumber' placeholder='Phonenumber' type='text' value={registerDetails.phonenumber} onChange={handleChange} name='phonenumber' />
                    </span>

                    <span>
                        <button type='submit' onClick={debrp}>Register</button>
                    </span>
                    <span id='tctxt'>
                        <p>By clicking Register you are agreeing to the <a href='https://www.google.com'>Terms and Conditions</a></p>
                    </span>
                    <span className='logbtn'>
                        <span>Already have an account?<a href='/login'>Login</a></span>
                    </span>

                </div>}
            {sent === true &&
                <div className='container'>
                    {successfulcreation === true &&
                        <div className='indicationcontainer Form_schem'>
                            <span><p>Registration complete!</p></span>
                            <span><button onClick={() => { document.location = '/login'; }}>Proceed to Login.</button></span>
                        </div>}

                    {successfulcreation === false &&
                        <div className='indicationcontainer Form_schem'>
                            <span><p>Registration Unsuccessful</p></span>
                            <span><button onClick={() => { setsent(false); setsc(false); }}>Click to try again.</button></span>
                        </div>}

                </div>}
        </div>
    </div>;
}
