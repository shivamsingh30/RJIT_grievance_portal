const express = require('express')
//console.log(express)
const app = express()
const port = 9000
const web = require('./routes/web')
const connectdb = require('./db/connectdb')
const fileUpload = require("express-fileupload");//for file upload
const cookieparser = require('cookie-parser') //for cookie

// for file upload
app.use(fileUpload({useTempFiles: true}));

// for get token (cookies)
app.use(cookieparser())

//for show message
let session = require('express-session')
let flash = require('connect-flash');

app.use(session({
  secret: 'secret',
  cookie: {maxAge:60000},
  resave: false,
  saveUninitialized: false,

}));

app.use(flash());


//view engine ejs
app.set('view engine','ejs')

//for image and css
app.use(express.static('public'))

//db connection
connectdb()

//for data get
app.use(express.urlencoded({extended:true}))

//route load
app.use('/',web)

//routing






//server create
app.listen(port, () => {
    console.log(`Example app running localhost: ${port}`)
  }) 