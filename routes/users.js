var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var User = require('../models/User');

/**
 * Helper function to check whether the user request is valid
 */
var isValidUserReq = function(req, res) {
    if (req.currentUser) {
        utils.sendErrResponse(res, 403, 'There is already a user logged in.');
        return false;
    } else if (!req.body.username) {
        utils.sendErrResponse(res, 400, 'Username not provided.');
        return false;
    }
    return true;
};

/*
  POST /users/login - log in a user
  Request parameters:
    - username: the username of the user
  Response: 
    - success: true if login succeeded
    - content: on success, the username
    - err: on failure, an error message
 */
router.post('/login', function(req, res) {
    if (isValidUserReq(req, res)) {
        User.authUser(req.query.username, req.query.password, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                req.session.username = req.body.username;
                utils.sendSuccessResponse(res, { user : req.body.username });
            }
        });
    }
});

/*
  POST /users/logout - log out a user
  Request parameters: none
  Response: 
    - success: true if login succeeded
    - err: on failure, an error message
 */
router.post('/logout', function(req, res) {
    if (req.currentUser) {
        req.session.destroy();
        utils.sendSuccessResponse(res);
    } else {
        utils.sendErrResponse(res, 403, 'There is no user currently logged in.');
    }
});

/*
  POST /users/create - create a user
  Request parameters:
    - username: the username of the user
  Response: 
    - success: true if login succeeded
    - content: on success, the username
    - err: on failure, an error message
 */
router.post('/create', function(req, res) {
    if (isValidUserReq(req, res)) {
        User.createUser(req.body.username, req.body.password, function(err,result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                req.session.username = req.body.username;
                utils.sendSuccessResponse(res, { user : result.username });
            }
        });
    }
});

/*
  GET /users/current - get current login status
  Request parameters: none
  Response: 
    - success: true if login succeeded
    - content: on success, an object with loggedIn as either true or false and the username if logged in
 */
router.get('/current', function(req, res) {
    if (req.currentUser) {
        utils.sendSuccessResponse(res, { loggedIn : true, user : req.currentUser.username });
    } else {
        utils.sendSuccessResponse(res, { loggedIn : false });
    }
});

/*
  GET /users/follows - get user's follows list
  Request parameters: 
    - username: the username of the follower
  Response: 
    - success: true if login succeeded
    - content: on success, a list of usernames the user follows
    - err: on failure, an error message
 */
router.get('/follows', function(req, res) {
    if (req.currentUser) {
        User.getFollows(req.query.username, function(err, result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                utils.sendSuccessResponse(res, { result: result} );
            }
        })
    } else {
        utils.sendSuccessResponse(res, { loggedIn : false });
    }
});

/*
  POST /users/follow - follow a user
  Request parameters: 
    - username: the username to follow
  Response: 
    - success: true if login succeeded
    - content: on success, a list of usernames the user follows
    - err: on failure, an error message
 */
router.post('/follow', function(req, res) {
    if (req.currentUser) {
        User.followUser(req.currentUser.username, req.body.username, function(err, result) {
            if (err) {
                utils.sendErrResponse(res, 403, err);
            } else {
                utils.sendSuccessResponse(res, { result: result} );
            }
        })
    } else {
        utils.sendSuccessResponse(res, { loggedIn : false });
    }
});

module.exports = router;
