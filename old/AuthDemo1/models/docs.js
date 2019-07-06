const mongoose = require('mongoose')

var DocSchema = new mongoose.Schema({
    Doc_name: String,
    source: Buffer,
    transition: [{
        employee_id: String,
        DateOfIntake: {
            type: Date,
            default: Date.now},
        completed: {type: Boolean ,default: false},
        comment: String,
    }],
    Date: {type: Date, default: Date.now} 
})

module.exports = mongoose.model("Docs", DocSchema);