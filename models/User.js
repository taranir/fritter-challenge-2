var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    username: String,
    password: String, 
    follows: [String]
});

/**
 * Find a user by username, error if not found
 *
 * @param username {string} - username to check
 * @param callback {function} - function to call with error and result
 */
userSchema.statics.findByUsername = function(rawUsername, callback) {
    var username = rawUsername.toLowerCase();
    this.find({ username: username }, function(err, result) {
        if (err) callback(err);
        else if (result.length > 0) callback(null, {username: username, _id: result[0]._id});
        else callback("User not found");
    });
}

/**
 * Add a follower
 *
 * @param rawFollower {string} - username of follower
 * @param rawUsername {string} - username of user to follow
 * @param callback {function} - function to call with error and result
 */
userSchema.statics.followUser = function(rawFollower, rawUsername, callback) {
    var follower = rawFollower.toLowerCase();
    var username = rawUsername.toLowerCase();
    this.find({ username: follower }, function(err, result) {
        this.find({username: username}, function(err2, user) {
            if (err2) callback(err2);
            else if (err) callback(err);
            else if (user.length === 0 || result.length === 0) {
                username = undefined;
                callback("User not found");
            }
            else if (result[0].follows.indexOf(username) > -1) {
                callback("User already follows");
            }
            else if (username === follower) {
                callback("User cannot follow self");
            }
            else {
                var follows = result[0].follows;
                follows.push(username);
                this.update({username: follower}, {follows: follows}, callback)
            }
        });
    });
}

/**
 * Get follows
 *
 * @param rawUsername {string} - username of follower
 * @param callback {function} - function to call with error and result
 */
userSchema.statics.getFollows = function(rawUsername, callback) {
    var username = rawUsername.toLowerCase();
    this.find({ username: username }, function(err, result) {
        if (err) callback(err);
        else if (result.length === 0) callback("User not found");
        else {
            callback(null, result[0].follows);
        }
    });
}

/**
 * Authenticate a user
 *
 * @param username {string} - username to check
 * @param password {string} - password to check
 * @param callback {function} - function to call with error and result
 */
userSchema.statics.authUser = function(rawUsername, password, callback) {
    var username = rawUsername.toLowerCase();
    this.find({username: username}, function(err,result) {
        if (err) callback(err);
        else if (result.length > 0) {
            if (bcrypt.compareSync(password, result[0].password)) callback(null, {username: username});
            else callback("Incorrect login");
        } else callback("Incorrect login");
    });
}

/**
 * Create a new user
 *
 * @param username {string} - username to create
 * @param password {string} - password
 * @param callback {function} - function to call with error and result
 */
userSchema.statics.createUser = function(rawUsername, password, callback) {
    var username = rawUsername.toLowerCase();
    if (username.match("^[a-z0-9_-]{3,16}$") && typeof password === 'string') {
        this.find({username: username}, function(err, result) {
            if (err) callback(err);
            else if (result.length === 0) {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);
                var user = new User({
                    username: username,
                    password: hash,
                    follows: []
                });
                user.save(function(err,result) {
                    if (err) callback(err);
                    else callback(null, {username: username});
                });
            } else callback("User already exists");
        });
    } else {
        callback("Invalid username/password");
    }
}

/**
 * Clear all users
 */
userSchema.statics.clearUsers = function() {
    this.remove({}, function() {});
}

var User = mongoose.model('User', userSchema);

module.exports = User;