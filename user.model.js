const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  email: String,
  picture: String,
});

module.exports = mongoose.model('user', schema);
