const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Docs = require('../models/Docs');
const bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({ extended: true })
// GET documents
// url /dashboard/documents
// view form for adding document
router.get('/', ensureAuthenticated, (req, res, next) => {
    console.log(req.session);    
    res.render('add')
});

// POST add
// url /dashboard/add
// add new document to db 
router.post('/', urlencodedParser, (req, res, next) => {
    var { doc_name, source, Date } = req.body; 
    var transition = [{
      employee_id: req.session.user._id,
      employee_name: req.session.user.name,
      Date,
      comment: 'start'
    }];

    //console.log(req.session);
    var newDoc = new Docs({
      doc_name,
      source,
      transition,
      Date,
      last_employee_id: req.session.user._id
    })
    newDoc.save();
    req.flash(
      'success_msg',
      'Document has been added successfully!'
    )
    res.redirect('/dashboard');
});

module.exports = router;



