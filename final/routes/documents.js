const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Docs = require('../models/Docs');

// GET documents
// url /dashboard/documents
// view documents stored in db
router.get('/', ensureAuthenticated, async (req, res) => {

    let docs_name = [];
    const docs = await Docs.find({})

    docs.forEach(doc =>{
        const isPresent = doc.transition.find(user => {
            return user.employee_id == req.session.user._id;
        })
        if(isPresent){
            docs_name.push({
                doc_name: doc.doc_name, 
                thread_closed: doc.thread_closed,
                last_seen: doc.last_employee_seen
            })
        }
    });

    // res.send(docs_name);
    res.render('documents', { docs_name: docs_name, user: req.session.user });
});
    

// POST documents
// url /dashboard/documents
// view transition of selected document 
router.post('/', async (req, res) => {

    const { selected_doc } = req.body;
    
    let docs_name = [];
    let doc_transition = [];
    let errors = [];

    const docs = await Docs.find({});
    const doc = await Docs.findOne({ doc_name: selected_doc});

    docs.forEach(doc =>{
        const isPresent = doc.transition.find(user => {
            return user.employee_id == req.session.user._id;
        })
        if(isPresent){
            docs_name.push({
                doc_name: doc.doc_name, 
                thread_closed: doc.thread_closed,
                last_seen: doc.last_employee_seen
            })
        }
    });

    const isPresent = docs_name.find(doc => {
        return doc.doc_name == selected_doc
    });

    if(!doc){
        errors.push({"msg": "Please Enter Valid Document name"});
        res.render('documents', { errors: errors, docs_name: docs_name, user: req.session.user });
    }

    else if(!isPresent) {
        errors.push({"msg": "You are not Authorized to view this Document"});
        res.render('documents', { errors: errors, docs_name: docs_name, user: req.session.user });
    }

    else {
        doc.transition.forEach(node => {
        doc_transition.push({ employee_name: node.employee_name, comment: node.comment});
        });
            
        res.render('documents', { docs_name: docs_name, user: req.session.user, doc_transition: doc_transition, selected_doc: selected_doc });
    }
});

    // res.send('documents page')

module.exports = router;



