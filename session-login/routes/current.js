const express = require('express');
const router = express.Router();
const Docs = require('../models/Docs');
const bodyParser = require('body-parser')


var urlencodedParser = bodyParser.urlencoded({ extended: true })

// Dashboard filepost
router.post('/send', urlencodedParser, (req, res) => {
    var { Doc_name, source, employee_name, comment } = req.body;  
    console.log(req.body)
    var obj = { Doc_name: Doc_name, source: source, employee_name: employee_name, comment: comment };
    Docs.findOneAndUpdate(
        { Doc_name: Doc_name },
        { $push: { transition: obj } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                //console.log(success);
            }
        }
    );
    res.redirect('/dashboard');
})

module.exports = router;