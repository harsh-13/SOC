const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Docs = require('../models/Docs');
const bodyParser = require('body-parser')


var urlencodedParser = bodyParser.urlencoded({ extended: true })

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, urlencodedParser , (req, res, next) =>
Docs.find({}, function(err, products) {
  res.render('dashboard', { products: products, user: req.user });
})
);

module.exports = router;
