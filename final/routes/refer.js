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
  
    
    let errors = [];
    let success = [];

    var user = null
    try{
      user = await Users.findById(employee_id)
    }
    catch(err) {
      console.log(err.message)
    }
  
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
          "msg":
          "Invalid Document name"
        });
    }
    else {
      if(!(doc.last_employee_id === req.session.user._id)){
        errors.push({
            'msg': 'You are not authorized!'
          });
      }
      else if(doc.thread_closed===true){
        errors.push({
            msg:
            'Selected document had already been terminated! Please Revive this document before assigning it again'
          })
      }
      else {
        update = {$push : { transition: obj }};
        filter = { doc_name: doc_name }
        const isUpdated = await Docs.findOneAndUpdate(filter, update);
        success.push({
          msg:
          'Document has been assigned successfully'
        })
      }
    }

    res.render('refer', { success: success , errors: errors, user: req.session.user})
});

router.post('/terminate', urlencodedParser, async (req, res) => {
    
    var { doc_name } = req.body
    let errors = [];
    let success = [];

    const doc = await Docs.findOne({ doc_name: doc_name })

    if(!doc){
      errors.push({
          "msg":
          "Invalid Document name"
        });
    }
    else {
      if(!(doc.last_employee_id === req.session.user._id)){
        errors.push({
            'msg': 'You are not authorized!'
          });
      }
      else if(doc.thread_closed===true){
        errors.push({
            msg:
            'Selected document had already been terminated!'
          })
      }
      else {
        update = {thread_closed : true }
        filter = { _id: doc._id }
        const isUpdated = await Docs.findOneAndUpdate(filter, update);
        success.push({
          msg:
          'Document has been terminated successfully'
        })
      }
    }

    res.render('refer', { success: success , errors: errors, user: req.session.user})
    
})

router.post('/revive', urlencodedParser, async (req, res) => {
  var { doc_name } = req.body
  let errors = [];
  let success = [];
    
  const doc = await Docs.findOne({ doc_name: doc_name })

  if(!doc){
    errors.push({
        "msg":
        "Invalid Document name"
      });
  }
  else {
    if(!(doc.last_employee_id === req.session.user._id)){
      errors.push({
          'msg': 'You are not authorized!'
        });
    }
    else if(doc.thread_closed===false){
      errors.push({
          msg:
          'Selected document had already been in Revived State!'
        })
    }
    else {
      update = {thread_closed : false }
      filter = { _id: doc._id }
      const isUpdated = await Docs.findOneAndUpdate(filter, update);
      success.push({
        msg:
        'Document has been revived successfully'
      })
    }
  }

  res.render('refer', { success: success , errors: errors, user: req.session.user})
})

module.exports = router;
