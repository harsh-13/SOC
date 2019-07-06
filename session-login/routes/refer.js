const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Docs = require('../models/Docs');
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
    
});

module.exports = router;



