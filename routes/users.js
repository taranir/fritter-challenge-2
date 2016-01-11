var express = require('express');
var router = express.Router();
var Users = require("../models/users.js");
var Posts = require("../models/posts.js");

//Logging out. Redirects to login page
router.get('/logout', function(req, res, next) {
  req.session.currentUser = false;
  res.redirect("/login");
});

//Logging in. Checks that user exists, else renders error page.
router.post('/login', function(req, res, next) {
  Users.find({username: req.body.username, password: req.body.password}, function(err, docs){
    if (docs.length > 0) {
      req.session.currentUser = req.body.username;
      res.redirect("../");
    }
    else {
      res.render('error_custom', { message: 'Invalid login credentials.' });
    }
  });
});

//Creating a new user. 
//Checks that both fields are filled in and that user doesn't already exist.
router.post('/create', function(req, res, next) {
  console.log("creating user");
  //check if fields are properly filled in
  if (req.body.username.length < 1) {
    res.render('error_custom', { message: 'Need username' });
  }
  else if (req.body.password.length < 1) {
    res.render('error_custom', { message: 'Need password' });
  }

  //check if user already exists
  else {
    Users.find({username: req.body.username}, function(err, docs){
      console.log(docs);
      if (docs.length > 0) {
        res.render('error_custom', { message: 'User already exists' });
      }
      //create user
      else {
        var u = new Users({username: req.body.username, password: req.body.password, followed: [], favorites: []});
        u.save(function(err){
          req.session.currentUser = req.body.username;
          console.log("user created");
          res.redirect('/');
        });
      }
    });
  }
  
});

// Get user profile page
router.get('/profile/:username', function(req, res) {
  if (req.session.currentUser) {
    // If the current user is trying to view his own profile, redirect to My Fritters
    if (req.params.username == req.session.currentUser) {
      res.redirect("/myposts");
    }
    else {
      // Check if current user already follows the profile user
      var alreadyFollowed = false;
      Users.findOne({username: req.session.currentUser}, function(e, doc) {
        if (doc.followed.indexOf(req.params.username) > -1) {
          alreadyFollowed = true;
        }
        var favList = doc.favorites;
        // Get the profile user's posts
        Posts.find({username: req.params.username}, function(e, docs) {
          console.log(favList);
          res.render('index', { 
            title: req.params.username + "'s Fritters",
            username: req.params.username,
            profile: true,
            followed: alreadyFollowed,
            feed: false,
            favs: favList,
            posts: docs.reverse()
          });
        });
      });


    }
  }
  else {
    res.redirect("/login");
  }
});


router.get('/follow/:username', function(req, res) {
  Users.update(
    {username: req.session.currentUser},
    {$addToSet: {followed: req.params.username} },
    {upsert: false },
    function(err, docs) {
      console.log("added " + req.params.username + " to " + req.session.currentUser + "'s followed");
      res.redirect("/myfeed");
    });
});

router.get('/unfollow/:username', function(req, res) {
  Users.update(
    {username: req.session.currentUser},
    {$pull: {followed: req.params.username} },
    function(err, docs) {
      console.log("added " + req.params.username + " to " + req.session.currentUser + "'s followed");
      res.redirect("/myfeed");
    });
});

module.exports = router;
