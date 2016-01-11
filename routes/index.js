var express = require('express');
var router = express.Router();
var Posts = require("../models/posts.js");
var Users = require("../models/users.js");


/* GET login page. */
router.get('/login', function(req, res) {
  console.log(req.session.currentUser);
  if (req.session.currentUser) {
    res.redirect("/");
  }
  else {
    res.render('login', { title: 'Login' });
  }  
});

/* GET home page. */
router.get('/', function(req, res) {
  if (req.session.currentUser) {
    Users.findOne({username: req.session.currentUser}, function(e, doc) {
      var favList = doc.favorites; //get list of favorites so we know which tweets have been favorited
      Posts.find({}, function(e, docs) {
        res.render('index', { 
          title: 'Fritter',
          username: req.session.currentUser,
          profile: false,
          followed: false,
          feed: false,
          favs: favList,
          posts: docs.reverse()
        });
      });
    });
  }
  else {
    res.redirect("/login");
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



/* GET my fritters page. */
router.get('/myposts', function(req, res) {
  if (req.session.currentUser) {
      Posts.find({username: req.session.currentUser}, function(e, docs) {
        res.render('index', { 
          title: 'My Fritters',
          username: req.session.currentUser,
          profile: false,
          followed: false,
          feed: false,
          favs: [], //can't fav own posts
          posts: docs.reverse()
        });
      });
    
  }
  else {
    res.redirect("/login");
  }
});

//GET my feed page
router.get('/myfeed', function(req, res) {
  if (req.session.currentUser) {
    Users.findOne({username: req.session.currentUser}, function(e, doc) {
      var favList = doc.favorites; //get list of favorites so we know which tweets have been favorited
      Posts.find({username: {$in: doc.followed}}, function(e, docs) {
        res.render('index', { 
          title: req.session.currentUser + "'s Feed",
          username: req.session.currentUser,
          profile: false,
          followed: false,
          feed: true,
          favs: favList,
          posts: docs.reverse()
        });          
      });
    });
  }
  else {
    res.redirect("/login");
  }
});

//GET my favs page
router.get('/myfavs', function(req, res) {
  if (req.session.currentUser) {
    Users.findOne({username: req.session.currentUser}, function(e, doc) {
      var favList = doc.favorites; //get list of favorites (not technically necessary here, but need it to pass into render)
      Posts.find({_id: {$in: doc.favorites}}, function(e, docs) {
        res.render('index', { 
          title: req.session.currentUser + "'s Favorites",
          username: req.session.currentUser,
          profile: false,
          followed: false,
          feed: true,
          favs: favList,
          posts: docs.reverse()
        });          
      });
    });
  }
  else {
    res.redirect("/login");
  }
});

module.exports = router;
