const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');


// GET profile
// url /dashboard/profile
// view profile of current user 
router.get('/', (req, res, next) => {
    console.log(req.isAuthenticated());
    res.send('profile page')
});

// POST profile
// url /dashboard/profile
// update profile of current user 
router.post('/', (req, res, next) => {

    res.send('profile page')
});

module.exports = router;



