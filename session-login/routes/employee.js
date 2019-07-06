const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// GET employee
// url /dashboard/employee 
// list down all employees stored in db
router.get('/', ensureAuthenticated, (req, res, next) => {



    res.send('employee page')
});

module.exports = router;



