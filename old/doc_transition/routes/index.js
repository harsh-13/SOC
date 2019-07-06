const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Docs = require('../models/Docs');
const bodyParser = require('body-parser');
const User = require('../models/User');


var urlencodedParser = bodyParser.urlencoded({ extended: true })

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, urlencodedParser , (req, res, next) => {
  
  req.session.userID = req.user;
  req.session.save(err => {
    if(err){
      console.log(err);
    }
  });
  console.log(req.session);
  Docs.find({}, function(err, products) {
    res.render('dashboard', { products: products, user: req.user, doc_transition: [] });
  })
});

router.get('/new', (req, res, next) => {
  // console.log(req.session);
  // res.send(req.session);
})


module.exports = router;
