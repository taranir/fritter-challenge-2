var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  followed: Array,
  favorites: Array
});



var User = mongoose.model("User", userSchema);
module.exports = User;