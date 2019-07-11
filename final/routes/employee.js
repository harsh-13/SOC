const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Users = require('../models/Users');
const bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({ extended: true })

// GET employee
// url /dashboard/employee 
// list down all employees stored in db
router.get('/', ensureAuthenticated, (req, res, next) => {
    Users.find({}, function (err, products) {
        res.render('employee', {products});
    })
});

module.exports = router;



