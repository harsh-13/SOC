const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');


// GET refer
// url /dashboard/refer
// view form to refer a document and list of document  
router.get('/refer', ensureAuthenticated, (req, res, next) => {

    res.send('refer page')
});

// POST refer
// url /dashboard/refer
// update transition of selected document
router.post('/refer', (req, res, next) => {

    res.send('refer page')
});

module.exports = router;



