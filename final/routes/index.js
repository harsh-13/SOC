const express = require('express');
const router = express.Router();
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const Docs = require('../models/Docs');
const bodyParser = require('body-parser')

// Load User model
const Users = require('../models/Users');


var urlencodedParser = bodyParser.urlencoded({ extended: true })

// Use subroutes
// router.use(ensureAuthenticated);
router.use('dashboard/profile', require('./profile'));
router.use('dashboard/employee', require('./employee'));
router.use('dashboard/refer', require('./refer'));
router.use('dashboard/documents', require('./documents'));
router.use('dashboard/add', require('./add'));


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => {
  res.render('welcome')
  // console.log(req.session)
  // console.log(req.session.userID)
});


// Dashboard
router.get('/dashboard', ensureAuthenticated, urlencodedParser , (req, res, next) => {
  
  req.session.user = req.user;
  req.session.save();
  
  Docs.find({}, function(err, products) {
    res.render('dashboard', { products: products, user: req.user });  
  })
  // console.log(req.isAuthenticated());
});


module.exports = router;
