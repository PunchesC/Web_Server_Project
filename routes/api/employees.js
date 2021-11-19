const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employeesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/')
  // Goes through verifyJWT first then employeeController, add verifyJWT in .get(verifyJWT, employeeController.getAllEmployees)) to make path only verify
    .get(employeeController.getAllEmployees)
  // post gets paramaters coming in. post introduce new employee
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeeController.createNewEmployee)
  // updating an employee different for real api
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeeController.updateEmployee)
  // delete
  .delete(verifyRoles(ROLES_LIST.Admin), employeeController.deleteEmployee);
// paramater from inside the URL
router.route('/:id')
  .get(employeeController.getEmployee);


module.exports = router;

// Dont need to very all routes 