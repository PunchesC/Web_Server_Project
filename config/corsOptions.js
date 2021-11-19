// Cross Origin Resource Sharing
// whitelist === what domain should have access to your data || "to use the backend"
// !origin helps with undefined in reqlog, should remove after development and other url 
// const whitelist = [
//   'https://www.yoursite.com',
//   'http://127.0.0.1:5500', 
//   'http://localhost:3500']

const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }, 
  optionsSuccessStatus: 200
}

module.exports = corsOptions;