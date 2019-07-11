const express = require('express');
const router = express.Router();
const Docs = require('../models/Docs');
const bodyParser = require('body-parser')


var urlencodedParser = bodyParser.urlencoded({ extended: true })

// Dashboard filepost
router.get('/view', urlencodedParser, (req, res, next) => {
    // var allDocuments;
    // var recievedDocuments;
    Docs.find({}, function(err, products) {
      console.log(products)
      res.render('dashboard', { products: products, user: req.user });
    })
    // Docs.find({'transition': {$elemMatch: {employee_name: req.user.name}}}, function(err, recievedDocs) {
    //     global.recievedDocuments = recievedDocs; 
    // });

    
})

module.exports = router;