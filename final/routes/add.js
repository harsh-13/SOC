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
    //console.log(req.session);
    res.render('add', { user: req.session.user })
});

// POST add
// url /dashboard/add
// add new document to db
router.post('/', urlencodedParser, async (req, res, next) => {
    let errors = []
    let success = []
    var { doc_name, source, Date } = req.body;
    var transition = [{
      employee_id: req.session.user._id,
      employee_name: req.session.user.name,
      Date,
      comment: 'start'
    }];

    const isPresent = await Docs.findOne({doc_name: doc_name})

    if(doc_name==''){
      errors.push({
        msg:
        'Please Enter a Valid Document name'
      });
      return res.render('add', {errors, user: req.session.user});
    }

    
    else if(isPresent){
      errors.push({
        msg:
        'Entered Document name already exists. Please choose another name for your document'
      });
      return res.render('add', {errors, user: req.session.user});
    }

    else {
      //console.log(req.session);
      var newDoc = new Docs({
        doc_name,
        source,
        transition,
        Date,
        last_employee_id: req.session.user._id
      })
      newDoc.save();
      success.push({
        'msg':
        'Document has been added successfully!'
      });
      res.render('add', {success, user: req.session.user});
    }

    
});

module.exports = router;
