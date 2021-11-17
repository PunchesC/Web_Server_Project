const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;


// ^ === begins with
// $ === ends with
// | === or
// ()? === optional
app.get('^/$|/index(.html)?',(req,res)=>{
  // ONE way
  // res.sendFile('./views/index.html', {root: __dirname});
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/new-page(.html)?',(req,res)=>{
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

//redirect
// 301 redirect
app.get('/old-page(.html)?',(req,res)=>{
  res.redirect(301,'/new-page.html');//302 by default

});


// Route Handlers
// can chain up routes

app.get('/hello(.html)?', (req,res,next) => {
  console.log('attempted to load hello.html');
  // next() moves onto next handler
  next()
}, (req,res)=> {
  res.send('Hello World!');
});

// chaining route handlers

const one = (req, res, next) => {
  console.log('one');
  next();
}
const two = (req, res, next) => {
  console.log('two');
  next();
}
const three = (req, res, next) => {
  console.log('three');
  res.send('Finished!')
}

// [] calling all functions
app.get('/chain(.html)?', [one, two,three]);


// catch-all its a waterfall of progression (put at end)
// 404 personal default page
app.get('/*',(req,res)=>{
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});




app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));