const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  picture: String,
  artists: [String],
  genres: [String],

});

module.exports = mongoose.model('user', UserSchema);
