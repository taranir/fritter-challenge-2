var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();
var Posts = require("../models/posts.js");
var Users = require("../models/users.js");

//Creating a new post
router.post('/new', function(req, res, next){
  console.log("creating new post");
  var p = new Posts({username: req.session.currentUser, text: req.body.text});
  p.save(function(err){
    res.redirect('/');
  });
});

//Editing a post
router.post('/edit', function(req, res, next){
  console.log("editing post");
  Posts.update(
   { _id: req.body.postID },
   {$set: { text: req.body.text} },
   { upsert: false }, 
   function(err, docs) {
    res.redirect('/');
   });
});

//Deleting a post
router.post('/delete', function(req, res, next){
  Posts.remove(
   { _id: req.body.postID }, function(err) {
    res.sendStatus(200);
   });
});

router.post('/fav', function(req, res) {
  console.log("faving post");
  Users.update(
    {username: req.session},
    {$addToSet: {favorites: req.body.postID} }, function(err) {
      console.log("done faving");
      res.sendStatus(200); 
  });
});

router.post('/unfav', function(req, res) {
  console.log("unfaving post");
  Users.update(
    {username: req.session},
    {$pull: {favorites: req.body.postID} }, function(err) {
      console.log("done faving");
      res.sendStatus(200); 
  });
});

module.exports = router;
