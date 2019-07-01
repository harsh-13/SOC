const express = require('express');
const router = express.Router();
const Docs = require('../models/Docs');
const bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({ extended: true })

// Dashboard filepost
router.post('/dashboard', urlencodedParser, (req, res) => {
    var { Doc_name, source, Date } = req.body;  
    console.log(req.body)
    var newDoc = new Docs({
      Doc_name,
      source,
      //transition,
      Date,
    })
    newDoc.save();
    res.redirect('/dashboard');
})

module.exports = router;