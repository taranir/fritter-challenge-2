var mongoose = require('mongoose');
var User = require('./User');

var freetSchema = new mongoose.Schema({
    text: String,
    ts: String, 
    author: String,
    isRefreet: Boolean,
    originalAuthor: String,
    authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

/**
 * Add a freet to the store; must have valid username
 *
 * @param rawUsername {string} - username of freet author
 * @param freetText {string} - freet text
 * @param timestamp {object} - moment defining timestamp of freet
 * @param callback {function} - function to be called with err and result
 */
freetSchema.statics.addFreet = function(rawUsername, freetText, timestamp, callback) {
    if (rawUsername && freetText.length > 0) {
        var username = rawUsername.toLowerCase();
        User.findByUsername(username, function(err, result) {
            if (err) {
                callback("Invalid username");
            } else {
                var freet = new Freet({
                    text: freetText,
                    ts: timestamp,
                    author: result.username,
                    authorId: result._id,
                    isRefreet: false
                });
                freet.save(callback);
            }
        });
    } else callback("Invalid freet")
}

/**
 * Add a refreet with valid refreet username
 *
 * @param rawUsername {string} - username of refreeter
 * @param id {string} - freet ID
 * @param timestamp {object} - moment defining timestamp of freet
 * @param callback {function} - function to be called with err and result
 */
freetSchema.statics.refreet = function(rawUsername, id, timestamp, callback) {
    this.find({_id: id}, function(err, result) {
        if (err) callback(err);
        else if (result.length === 0) callback("Freet does not exist");
        else {
            if (rawUsername) {
                var freet = result[0];
                var username = rawUsername.toLowerCase();
                User.findByUsername(username, function(err, user) {
                    if (err) {
                        callback("Invalid username");
                    } else if (username === freet.author) {
                        callback("Cannot refreet own freet");
                    } else if (freet.isRefreet) {
                        callback("Cannot refreet refreet");
                    } else {
                        var newFreet = new Freet({
                            text: freet.text,
                            ts: timestamp,
                            author: user.username,
                            authorId: user._id,
                            isRefreet: true,
                            originalAuthor: freet.author,
                        });
                        newFreet.save(callback);
                    }
                });
            } else callback("Invalid username");
        }
    });
}

/**
 * Get a freet by ID
 *
 * @param id {string} - uuid of freet
 * @param callback {function} - function to be called with err and result
 */
freetSchema.statics.getFreetById = function(id, callback) {
    this.find({_id: id}, function(err, result) {
        if (err) callback(err);
        else if (result.length > 0) callback(null, result[0]);
        else callback("Freet not found");
    });
}

/**
 * Get freets matching username(s)
 *
 * @param rawUsername {string} - username of current user
 * @param authors {object} - usernames to match; must be all lowercase
 * @param callback {function} - function to be called with err and result
 */
freetSchema.statics.getFreetsByAuthor = function(rawUsername, authors, callback) {
    if (rawUsername) {
        var username = rawUsername.toLowerCase();
        this.find({author: {$in: authors}}, function(err, freets) {
            if (err) callback(err);
            else {
                User.findByUsername(username, function(err, result) {
                    if (err) callback(null, []);
                    else callback(null, freets)
                });
            }
        });
    } else callback(null, []);
};

/**
 * Get all freets
 *
 * @param rawUsername {string} - username of current user
 * @param callback {function} - function to be called with err and result
 */
freetSchema.statics.getFreets = function(rawUsername, callback) {
    if (rawUsername) {
        var username = rawUsername.toLowerCase();
        this.find({}, function(err, freets) {
            if (err) callback(err);
            else {
                User.findByUsername(username, function(err, result) {
                    if (err) callback(null, []);
                    else callback(null, freets)
                });
            }
        });
    } else callback(null, []);
};

/**
 * Delete freet by ID
 *
 * @param username {string} - username of user initiating delete; must match freet author
 * @param id {string} - freet uuid
 * @param callback {function} - function to be called with err and result
 */
freetSchema.statics.deleteFreetById = function(rawUsername, id, callback) {
    if (rawUsername) {
        var username = rawUsername.toLowerCase();
        this.remove({author: username, _id: id}, function(err, result) {
            if (err) callback(err);
            else if (result.result.n === 0) callback("Deletion failed");
            else callback(null);
        });
    } else callback("Invalid username");
}

/**
 * Clear all freets
 */
freetSchema.statics.clearFreets = function() {
    this.remove({}, function() {});
}

var Freet = mongoose.model('Freet', freetSchema);

module.exports = Freet;