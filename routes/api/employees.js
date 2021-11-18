const express = require('express');
const router = express.Router();
const data = {};
data.employees = require('../../data/employees.json');

router.route('/')
    .get((req, res)=>{
      res.json(data.employees)
    })
  // post gets paramaters coming in. post introduce new employee
  .post((req,res) => {
    res.json({
      "firstname": req.body.firstname,
      "lastname" : req.body.lastname
    });

  })
  // updating an employee different for real api
  .put((req,res) =>{
    res.json({
      "firstname": req.body.firstname,
      "lastname" : req.body.lastname
    });
  })
  // delete
  .delete((req,res)=>{
    res.json({
      "id": req.body.id
    });
  });
// paramater from inside the URL
router.route('/:id')
  .get((req, res)=>{
    res.json({"id": req.params.id});
  });


module.exports = router;