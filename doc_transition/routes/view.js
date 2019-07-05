const express = require('express');
const router = express.Router();
const Docs = require('../models/Docs');
const bodyParser = require('body-parser')


var urlencodedParser = bodyParser.urlencoded({ extended: true })

// Dashboard filepost
router.post('/view', urlencodedParser, (req, res, next) => {
    Docs.findOne({ Doc_name: req.body.doc_transition }, (err, doc) => {
        // res.render('dashboard', { doc: doc, user: req.user });
        // console.log(req.body.doc_transition);
        // console.log(product);
        
        
        if (doc !== null) {
            (doc.transition).forEach(function(element) {
                console.log(element.employee_name);
            });
        }

        Docs.find({}, function(err, products) {

            res.render('dashboard', { doc: doc, user: req.body.user, products});
        })

    });


})

module.exports = router;