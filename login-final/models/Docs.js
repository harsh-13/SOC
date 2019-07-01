const mongoose = require('mongoose')

const DocSchema = new mongoose.Schema({
    Doc_name: {
        type: String,
    },
    source: {
        type: Buffer, 
        contentType: String,
        //required: true
    },
    // transition: [{
    //     employee_id: {type: String, default: ''},
    //     DateOfIntake: {
    //         type: Date,
    //         default: Date.now},
    //     completed: {type: Boolean ,default: false},
    //     comment: {type: String, default: 'Started'}
    // }],
    Date: {
        type: Date, 
        default: Date.now
    } 
})

module.exports = mongoose.model("Docs", DocSchema);