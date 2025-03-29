const express = require('express');
const app = express();

const helmet = require('helmet');
const cors = require("cors")
var cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const compression = require('compression')


const registerRoutes = require('./regiops/register.js');//register routes
const loginRoute = require('./loginops/login.js');//login routes
const messageRoute = require('./message_handle/messproc.js') // message handling routes
const miscops = require('./Miscops/miscops.js')


app.use(compression()) // for perfromance enhancement
app.use(cookieParser())
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//starts server---
app.listen(process.env.PORT || 8080,(err)=>{if(!err){console.log('listening on port :'+process.env.PORT)}else{console.log(err)}}) // Listen to incoming http requests on the port specified or on port 8080 if the port specified is already in use. if there is no error then display the message that the server is listening on the port.
app.use(cors({origin:process.env.CORS_ORIGIN,credentials:true})) // cross origin resource sharing - only incoming requests from the origin url wil be allowed. 
app.use(helmet()) // response headers removal - preventing the displaying of headers which may cause system vulnerabilities 
app.use((req,res,next)=>{
  res.set('Server','H26') // H26 server moniker
  next()
})

//these tell the server to use these routes.
//app.use(registerRoutes);//register routes
app.use("/api",[loginRoute,registerRoutes,miscops]); // login routes 
app.use("/api/m",messageRoute); // message routes





