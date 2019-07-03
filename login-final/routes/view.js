const express = require('express');
const router = express.Router();
const Docs = require('../models/Docs');
const bodyParser = require('body-parser')


var urlencodedParser = bodyParser.urlencoded({ extended: true })

// Dashboard filepost
router.get('/view', urlencodedParser, (req, res, next) => {
    Docs.find({}, function(err, products) {
        res.render('dashboard', { products: products, user: req.user });
    });
})

module.exports = router;