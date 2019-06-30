var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username:String,
    password:String
});

var DocSchema = new mongoose.Schema({
    Doc_name: String,
    source: String,
    transition: [{
        employee_id: String,
        DateOfIntake: Date,
        completed: {type: Boolean ,default: false},
        comment: String,
    }],
    Date: Date 
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);
module.exports = mongoose.model("docs",DocSchema);
