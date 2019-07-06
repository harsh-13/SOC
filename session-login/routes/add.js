const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// GET documents
// url /dashboard/documents
// view form for adding document
router.get('/', ensureAuthenticated, (req, res, next) => {

    res.send('add page')
});

// POST add
// url /dashboard/add
// add new document to db 
router.post('/', (req, res, next) => {

    res.send('add page')
});

module.exports = router;



