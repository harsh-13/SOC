const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  contact: {
    type: Number,
    required: false
  },
  image: {
    type: Buffer,
    required: false,
    contentType: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
});

const Users = mongoose.model('User', UserSchema);

module.exports = Users;
