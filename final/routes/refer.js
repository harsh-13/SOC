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
    res.render('refer',{ user: req.session.user } )
});

// POST refer
// url /dashboard/refer
// update transition of selected document
router.post('/', urlencodedParser, async (req, res, next) => {

    var { doc_name, source, employee_id, comment } = req.body;
    let errors = []
    let success = []
    //console.log(req.body)
    const user = await Users.findById(employee_id);
    if(!user) {
      errors.push({
        'msg':
        'Invalid employee ID'
      })
      res.render('refer', { errors, user: req.session.user })
    }

    var obj = { source: source, employee_name: user.name, employee_id: employee_id, comment: comment };

    const doc = await Docs.findOne({ doc_name: doc_name })

    if(!doc){
      errors.push({
          'msg':
          'Invalid Document name'
        })
    }
    else {
      if(!(doc.last_employee_id === req.session.user._id)){
        errors.push({
            'msg':
            'You are not authorized!'
          })
      }
      else if(thread_closed===true){
        errors.push({
            'msg':
            'Selected document had already been terminated! Please Revive this document before assigning it again'
          })
      }
      else {
        update = {$push : { transition: obj }};
        filter = { doc_name: doc_name }
        const success = await Docs.findOneAndUpdate(filter, update);
        success.push({
          'msg':
          'Document has been assigned successfully'
        })
      }
    }

    res.render('refer', { success, errors, user: req.session.user})

    //
    // Docs.findOneAndUpdate(
    //         { doc_name: doc_name, last_employee_id: req.session.user._id, thread_closed: false },
    //         { $push: { transition: obj },
    //           last_employee_id: employee_id },
    //             function (error, success) {
    //               if (error) {
    //                   console.log(error);
    //               } else {
    //                   ///console.log(success);
    //                   if (!success) {
    //                     console.log(success)
    //                     errors.push(
    //                         'msg',
    //                         'You are not authorized bitch!'
    //                       )
    //                   } else {
    //                     success.push(
    //                         'msg',
    //                         'Document has been referred successfully!'
    //                       )
    //                   }
    //               }
    //         }
    //     );
    // })
    // res.redirect('/dashboard');
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
