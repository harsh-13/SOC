const mongoose = require('mongoose')

const DocSchema = new mongoose.Schema({
    doc_name: {
        type: String,
    },
    source: {
        type: Buffer, 
        contentType: String,
        required: false
    },
    source_link: {
        type: String,
        required: false
    },
    transition: 
    [{
        updated_source: {
            type: Buffer, 
            contentType: String,
            required: false
        },
        updated_source_link: {
            type: String,
            required: false
        },
        employee_id: {
            type: String, 
            required: true
        },
        employee_name: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        //completed: {type: Boolean ,default: false},
        comment: {
            type: String, 
            default: ''
        }
    }],
    Date: {
        type: Date, 
        default: Date.now
    },
    last_employee_id: {
        type: String,
        required: true
    },
    last_employee_seen: {
        type: Boolean,
        default: false
    },
    thread_closed: {
        type: Boolean,
        default: false
    }   

})

module.exports = mongoose.model("Docs", DocSchema);