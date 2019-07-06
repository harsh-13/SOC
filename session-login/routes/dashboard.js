const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Docs = require('../models/Docs');
const bodyParser = require('body-parser')

// Load User model
const Users = require('../models/Users');

var urlencodedParser = bodyParser.urlencoded({ extended: true })


// Use subroutes
router.use(ensureAuthenticated);
router.use('/profile', require('./profile'));
router.use('/employee', require('./employee'));
router.use('/refer', require('./refer'));
router.use('/documents', require('./documents'));
router.use('/add', require('./add'));

// Dashboard
var docArray = []
router.get('/', urlencodedParser , (req, res, next) => {
  
  Users.findOne({ name: req.user.name }, (err, user) => {
    req.session.userID = user._id;
    req.session.name = user.name;
  });
  
  Docs.find({}, function(err, products) {
    docArray = products;
  })
  // console.log(req.isAuthenticated());
  res.render('dashboard', { products: docArray, user: req.user });
});


module.exports = router;