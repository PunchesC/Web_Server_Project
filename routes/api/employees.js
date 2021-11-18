const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employeesController')

router.route('/')
    .get(employeeController.getAllEmployees)
  // post gets paramaters coming in. post introduce new employee
  .post(employeeController.createNewEmployee)
  // updating an employee different for real api
  .put(employeeController.updateEmployee)
  // delete
  .delete(employeeController.deleteEmployee);
// paramater from inside the URL
router.route('/:id')
  .get(employeeController.getEmployee);


module.exports = router;