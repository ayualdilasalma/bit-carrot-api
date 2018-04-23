var mongoose = require('mongoose');
var MODEL_NAME = 'User';
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    // unique: true,
    required: true,
    // trim: true
  },
  username: {
    type: String,
    // unique: true,
    required: true,
    // trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  }
});

var User = mongoose.model(MODEL_NAME, UserSchema);
module.exports = User;