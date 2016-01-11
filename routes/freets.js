var express = require('express');
var moment = require('moment');
var router = express.Router();
var utils = require('../utils/utils');
var Freet = require('../models/Freet');

/*
  GET /freets - get all freets
  Request parameters: none
  Response: 
    - success: true if getFreets succeeded
    - content: on success, a list of all freet objects
 */
router.get('/', function(req, res) {
  var username = undefined;
  if (req.currentUser) {
    username = req.currentUser.username;
    Freet.getFreets(username, function(err,result) {
        utils.sendSuccessResponse(res, result);
    });
  } else {
    utils.sendErrResponse(res, 403, 'Not authenticated');
  }
  
});

/*
  GET /freets/filter - get all freets
  Request parameters:
    - authors: array of authors whose tweets to see
  Response: 
    - success: true if getFreets succeeded
    - content: on success, a list of all freet objects
 */
router.get('/filter', function(req, res) {
  var username = undefined;
  if (req.currentUser) {
    username = req.currentUser.username;
    Freet.getFreetsByAuthor(username, req.query.authors, function(err,result) {
      utils.sendSuccessResponse(res, result);
    });
  } else {
    utils.sendErrResponse(res, 403, 'Not authenticated');
  }
});

/*
  GET /freets/{freetId} - get a single freet
  Request parameters: none
  Response: 
    - success: true if getFreetById succeeded
    - content: on success, the freet object
    - err: on failure, an error message
 */
router.get('/:fid', function(req, res) {
    Freet.getFreetById(req.params.fid, function(err,result) {
        if (err) {
            utils.sendErrResponse(res, 403, err);
        } else {
            utils.sendSuccessResponse(res, result);
        }
    });
});

/*
  POST /freets/add - add a new freet (must be valid user)
  Request parameters:
    - freet: text of the freet to add
  Response: 
    - success: true if freet addition succeeded
    - content: on success, the freet ID
    - err: on failure, an error message
 */
router.post('/add', function(req, res) {
  var username = undefined;
  if (req.currentUser) {
    username = req.currentUser.username;
  }
  Freet.addFreet(username, req.body.freet, moment(), function(err, result) {
      if (err) {
          utils.sendErrResponse(res, 403, err);
      } else {
          utils.sendSuccessResponse(res, result);
      }
  });
})

/*
  POST /freets/rf - refreet a freet (must be valid user)
  Request parameters:
    - freetId: id of the freet to refreeet
  Response: 
    - success: true if freet addition succeeded
    - content: on success, the freet ID
    - err: on failure, an error message
 */
router.post('/rf', function(req, res) {
  var username = undefined;
  if (req.currentUser) {
    username = req.currentUser.username;
  }
    Freet.refreet(username, req.body.freetId, moment(), function(err, result) {
        if (err) {
            utils.sendErrResponse(res, 403, err);
        } else {
            utils.sendSuccessResponse(res, result);
        }
    });
})

/*
  POST /freets/delete - delete a freet (must be authorized user)
  Request parameters:
    - freetId: the freet UUID
  Response: 
    - success: true if freet deletion succeeded
    - content: on success, the freet object
    - err: on failure, an error message
 */
router.post('/delete', function(req, res) {
  var username = undefined;
  if (req.currentUser) {
    username = req.currentUser.username;
  }
    Freet.deleteFreetById(username, req.body.freetId, function(err, result) {
        if (err) {
            utils.sendErrResponse(res, 403, err);
        } else {
            utils.sendSuccessResponse(res, result);
        }
    });
})

module.exports = router;
