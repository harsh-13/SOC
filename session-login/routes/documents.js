const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Docs = require('../models/Docs');

// GET documents
// url /dashboard/documents
// view documents stored in db
router.get('/', ensureAuthenticated, (req, res, next) => {

    let docs_name = [];
    Docs.find({}, (err, docs) => {
        docs.forEach(doc =>{
            docs_name.push({
                doc_name: doc.doc_name, 
                thread_closed: doc.thread_closed
            })
        });

        // res.send(docs_name);
        res.render('documents', { docs_name: docs_name, user: req.session.user });
    });
    
});

// POST documents
// url /dashboard/documents
// view transition of selected document 
router.post('/', (req, res, next) => {

    const { doc_name } = req.body;
    
    let docs_name = [];
    let doc_transition = []
    Docs.find({}, (err, docs) => {
        docs.forEach(doc =>{
            docs_name.push({
                doc_name: doc.doc_name, 
                thread_closed: doc.thread_closed
            })
        });
        
        Docs.findOne({ doc_name: doc_name}, (err, doc) => {
            if(doc){
                doc.transition.forEach(node => {
                doc_transition.push({ employee_name: node.employee_name, comment: node.comment});
            })}
            
            else {
                doc_transition.push({ employee_name: 'Entered file is invalid', comment: ''})
            }
            
            res.render('documents', { docs_name: docs_name, user: req.session.user, doc_transition: doc_transition });
            
        });
    })

});

    // res.send('documents page')

module.exports = router;



