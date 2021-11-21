require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn')
const { ca } = require('date-fns/locale');
const { connect } = require('http2');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check = before CORS!
// and fetch cookies credentials requirement
// Use before CORS
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));


// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended:false}));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));



// routes
app.use('/', require('./routes/root'));

app.use('/register', require('./routes/register'));

app.use('/auth', require('./routes/auth'));

// Refresh should go before verify JWT
app.use('/refresh', require('./routes/refresh'));

app.use('/logout', require('./routes/logout'));


// Only good spot for JWTverify since other need access to the root, being able to register, and even to authorization.
// Remember works like a waterfall
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

// catch-all its a waterfall of progression (put at end)
// 404 personal default page
// app.all
app.all('*',(req,res)=>{
  res.status(404)
  if(req.accepts('html')){
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({error: "404 Not Found"})
  } else {
    res.type('txt').send("404 Not Found");
  }
  

});


// custom error handler

app.use(errorHandler);

// Only going to listen to request if there is a connection
mongoose.connection.once('open', ()=> {
  console.log('Connected to MongoDB');
  app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
})


// // ^ === begins with
// // $ === ends with
// // | === or
// // ()? === optional
// app.get('^/$|/index(.html)?',(req,res)=>{
//   // ONE way
//   // res.sendFile('./views/index.html', {root: __dirname});
//   res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });

// app.get('/new-page(.html)?',(req,res)=>{
//   res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
// });

// //redirect
// // 301 redirect
// app.get('/old-page(.html)?',(req,res)=>{
//   res.redirect(301,'/new-page.html');//302 by default

// });


// Route Handlers
// can chain up routes

// app.get('/hello(.html)?', (req,res,next) => {
//   console.log('attempted to load hello.html');
//   // next() moves onto next handler
//   next()
// }, (req,res)=> {
//   res.send('Hello World!');
// });

// chaining route handlers

// const one = (req, res, next) => {
//   console.log('one');
//   next();
// }
// const two = (req, res, next) => {
//   console.log('two');
//   next();
// }
// const three = (req, res, next) => {
//   console.log('three');
//   res.send('Finished!')
// }

// // [] calling all functions
// app.get('/chain(.html)?', [one, two,three]);