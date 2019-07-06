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
var docArray = []
router.get('/dashboard', ensureAuthenticated, urlencodedParser , (req, res, next) => {
  
  req.session.user = req.user;
  req.session.userID = req.user._id;
  req.session.save(err => {
    if(err) console.log(err);
  });

  // console.log(req.session);
  
  Docs.find({}, function(err, products) {
    docArray = products;
  })
  // console.log(req.isAuthenticated());
  res.render('dashboard', { products: docArray, user: req.user });
});


module.exports = router;
