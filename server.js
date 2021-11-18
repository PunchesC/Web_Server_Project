const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const { ca } = require('date-fns/locale');
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
// whitelist === what domain should have access to your data || "to use the backend"
// !origin helps with undefined in reqlog, should remove after development and other url 
const whitelist = ['https://www.yoursite.com','http://127.0.0.1:5500', 'http://localhost:3500']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }, 
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));


// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended:false}));

// built-in middleware for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));

app.use('/subdir',express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));

app.use('/subdir', require('./routes/subdir'));

app.use('/employees', require('./routes/api/employees'));

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

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));