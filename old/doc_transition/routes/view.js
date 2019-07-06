const express = require('express');
const router = express.Router();
const Docs = require('../models/Docs');
const bodyParser = require('body-parser');
const User = require('../models/User');


var urlencodedParser = bodyParser.urlencoded({ extended: true })

// Dashboard filepost
router.post('/view', urlencodedParser, (req, res, next) => {
    Docs.findOne({ Doc_name: req.body.doc_transition }, (err, doc) => {
        // res.render('dashboard', { doc: doc, user: req.user });
        // console.log(req.body.doc_transition);
        // console.log(product);
        
        doc_transition = [];
        
        if(doc){
            (doc.transition).forEach(function(element) {
                doc_transition.push(element.employee_name);
            });
        }
        else{
            doc_transition.push('Invalid document name');
        }

        User.findById(req.session.passport.user, (err, user) =>{
            Docs.find({}, function(err, products) {
                res.render('dashboard', { doc_transition: doc_transition, user: user, products: products});
            });
        })
    });
})

module.exports = router;