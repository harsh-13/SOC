const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// GET documents
// url /dashboard/documents
// view documents stored in db
router.get('/', ensureAuthenticated, (req, res, next) => {

    res.send('documents page')
});

// POST documents
// url /dashboard/documents
// view transition of selected document 
router.post('/', (req, res, next) => {

    res.send('documents page')
});

module.exports = router;



