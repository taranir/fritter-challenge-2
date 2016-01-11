var mongoose = require("mongoose");

var postSchema = mongoose.Schema({
  text: String,
  username: String
});



var Post = mongoose.model("Post", postSchema);
module.exports = Post;