const mongoose = require('mongoose');
const { stringify } = require('uuid');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  firstname: {
    type: String,
    require: true
  },
  lastname: {
    type: String,
    require: true
  }
});

// creating a data model\
// Mongoose automatically looks for the plural, lowercased version of your model name. 
module.exports = mongoose.model('Employee', employeeSchema)