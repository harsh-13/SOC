const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Docs = require('../models/Docs');
const Users = require('../models/Users');
const bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({ extended: true })

// GET refer
// url /dashboard/refer
// view form to refer a document and list of document  
router.get('/', ensureAuthenticated, (req, res, next) => {
    res.render('refer')
});

// POST refer
// url /dashboard/refer
// update transition of selected document
router.post('/', urlencodedParser, (req, res, next) => {

    var { doc_name, source, employee_id, comment } = req.body;  
    //console.log(req.body)
    Users.findById(employee_id, function (err, user) {
        var obj = { source: source, employee_name: user.name, employee_id: employee_id, comment: comment };
        Docs.findOneAndUpdate(
            { doc_name: doc_name, last_employee_id: req.session.user._id, thread_closed: false },
            { $push: { transition: obj },
              last_employee_id: employee_id },
                function (error, success) {
                  if (error) {
                      console.log(error);
                  } else {
                      ///console.log(success);
                      if (!success) {
                        console.log(success)
                        req.flash(
                            'error_msg',
                            'You are not authorized bitch!'
                          )
                      } else {
                        req.flash(
                            'success_msg',
                            'Document has been referred successfully!'
                          )
                      }
                  }
            }
        );
    })
    res.redirect('/dashboard');
});

router.post('/terminate', urlencodedParser, (req, res, next) => {
    var { doc_name } = req.body
    Docs.findOneAndUpdate(
        { doc_name: doc_name, last_employee_id: req.session.user._id, thread_closed: false },
        { thread_closed: true },
        function (error, success) {
            if (error) {
                console.log(error)
            } else {
                //console.log(success)
            }
        })
    res.redirect('/dashboard')
})

router.post('/revive', urlencodedParser, (req, res, next) => {
    var { doc_name } = req.body
    Docs.findOneAndUpdate(
        { doc_name: doc_name, last_employee_id: req.session.user._id, thread_closed: true },
        { thread_closed: false },
        function (error, success) {
            if (error) {
                console.log(error)
            } else {
                //console.log(success)
            }
        })
    res.redirect('/dashboard')
})

module.exports = router;



