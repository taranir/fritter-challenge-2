var assert = require("assert");
var mongoose = require("mongoose");
var moment = require("moment");
var User = require("../models/User");
var Freet = require("../models/Freet");

mongoose.connect('mongodb://localhost/model_test');
User.clearUsers();
User.createUser("kim", "pass123", function() {});
User.createUser("123", "pass", function(){});
User.createUser("456", "pa1242412ss2", function(){});

// test user model
describe("User", function() {

    //test findByUsername
    describe("#findByUsername", function () {
        // test nonexistent user
        it("should return error when user does not exist", function (done) {
            User.findByUsername("hello", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test created user
        it("should return username when user exists", function (done) {
            User.findByUsername("kim", function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result.username, "kim");
                done();
            });
        });

        // test created user capitalized
        it("should return username when user exists even if capitalized", function (done) {
            User.findByUsername("Kim", function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result.username, "kim");
                done();
            });
        });

    });

    //test followUser
    describe("#followUser", function () {
        // test nonexistent user
        it("should return error when user does not exist", function (done) {
            User.followUser("123", "fail", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test nonexistent follower
        it("should return error when follower does not exist", function (done) {
            User.followUser("fake_user", "kim", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test following self
        it("should return error when follower tries to follow self", function (done) {
            User.followUser("kim", "kim", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test already following
        it("should return error when follower already follows user", function (done) {
            User.followUser("123", "kim", function(err, result) {
                User.followUser("123", "kim", function(err2, result) {
                    assert.notDeepEqual(err2, null);
                    done();
                });
            });
        });

        // test success
        it("should return success when user follows successfully", function (done) {
            User.followUser("kim", "123", function(err, result) {
                assert.deepEqual(err, null);
                done();
            });
        });

    });

    //test getFollows
    describe("#getFollows", function () {
        // test nonexistent user
        it("should return error when user does not exist", function (done) {
            User.getFollows("fail", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test success
        it("should return results when user follows successfully", function (done) {
            User.followUser("456", "123", function(err1,result1) {
                User.followUser("456", "kim", function(err2, result2) {
                    User.getFollows("456", function(err, result) {
                        assert.deepEqual(err, null);
                        assert.deepEqual(result.length, 2);
                        assert.ok(result.indexOf("kim") > -1);
                        assert.ok(result.indexOf("123") > -1);
                        done();
                    });
                })
            })
        });

    });

    //test authUser
    describe("#authUser", function () {

        // test nonexistent user
        it("should return error when user does not exist", function (done) {
            User.authUser("hello", "hoo", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test incorrect pass
        it("should return error when incorrect password", function (done) {
            User.authUser("kim", "pass", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test existing user
        it("should not return error when user exists", function (done) {
            User.authUser("kim", "pass123", function(err, result) {
                assert.deepEqual(err, null);
                done();
            });
        });

        // test existing user different capitalization
        it("should not return error when user exists with different capitalization", function (done) {
            User.authUser("Kim", "pass123", function(err, result) {
                assert.deepEqual(err, null);
                done();
            });
        });

    });

    //test createUser
    describe("#createUser", function () {
        // test nonexistent user
        it("should return error when user exists", function (done) {
            User.createUser("kim", "pass", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test username min length
        it("should return error when username too short", function (done) {
            User.createUser("ki", "pass", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test username max length
        it("should return error when username too long", function (done) {
            User.createUser("kewfewfweewfefwgi", "pass", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test username invalid characters
        it("should return error when username has invalid chars", function (done) {
            User.createUser("hi<>mi", "pass", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test new user
        it("should not return error when user does not exist", function (done) {
            User.createUser("eek", "pass", function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result, {username: "eek"});
                done();
            });
        });

        // test new user capitalized
        it("should not return error when username capitalized", function (done) {
            User.createUser("Blah", "pass", function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result, {username: "blah"});
                done();
            });
        });
    });

});

// test freet model
describe("Freet", function() {

    //test addFreet
    describe("#addFreet", function () {

        // test nonexistent user
        it("should fail when has a nonexistent user", function (done) {
            Freet.addFreet("djax", "hello world", moment(), function(err, result) {
                assert.notDeepEqual(err, null);
                Freet.clearFreets();
                done();
            });
        });

        // test valid freet
        it("should succeed when has a valid username", function (done) {
            Freet.addFreet("Kim", "hello world", moment(), function(err, result) {
                assert.deepEqual(err, null);
                assert.notDeepEqual(result._id, undefined);
                Freet.clearFreets();
                done();
            });
        });

    });

    //test refreet
    describe("#refreet", function () {

        // test nonexistent freet, should fail
        it("should fail when has an invalid id", function (done) {
            Freet.refreet("djax", "391494i92jq", moment(), function(err, result) {
                assert.notDeepEqual(err, null);
                Freet.clearFreets();
                done();
            });
        });

        // test same author
        it("should fail when user refreets own tweet", function (done) {
            Freet.addFreet("kim", "hello world", moment(), function(err, result) {
                var id = result._id;
                Freet.refreet("kim", id, moment(), function(err1, result1) {
                    assert.notDeepEqual(err1, null);
                    Freet.clearFreets();
                    done();
                });
            });
        });

        // test valid freet, should succeed
        it("should succeed when is a valid freet", function (done) {
            Freet.addFreet("kim", "hello world", moment(), function(err, result) {
                var id = result._id;
                Freet.refreet("123", id, moment(), function(err1, result1) {
                    Freet.getFreets("kim", function(err2, result2) {
                        assert.deepEqual(err1, null);
                        assert.deepEqual(result2.length, 2);
                        Freet.clearFreets();
                        done();
                    });
                });
            });
        });

    });

    //test getFreetById
    describe("#getFreetById", function () {

        // test invalid freet id
        it("should fail when invalid id", function (done) {
            Freet.getFreetById("fakeId", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        // test valid freet
        it("should succeed when valid id", function (done) {
            Freet.addFreet("kim", "hello world", moment(), function(err, result) {
                var id = result._id;
                Freet.getFreetById(id, function(err, result) {
                    assert.deepEqual(err, null);
                    assert.deepEqual(result.text, "hello world")
                    Freet.clearFreets();
                    done();
                });
            });
        });
    });

    //test getFreetsByAuthor
    describe("#getFreetsByAuthor", function () {
        // test getting all the freets for one user
        it("should return one user's freets", function (done) {
            Freet.addFreet("123", "hello world1", moment(), function() {
                Freet.addFreet("123", "hello world2", moment(), function() {
                    Freet.addFreet("456", "hewefllo world2", moment(), function() {
                        Freet.getFreetsByAuthor("456", "123", function(err, result) {
                            assert.deepEqual(err, null);
                            assert.deepEqual(result.length,2);
                            assert.deepEqual(result[0].author,"123");
                            assert.deepEqual(result[0].text,"hello world1");
                            assert.deepEqual(result[1].author,"123");
                            assert.deepEqual(result[1].text,"hello world2");
                            Freet.clearFreets();
                            done();
                        });
                    });
                });
            });
        });

        // test getting all the freets for multiple users
        it("should return multiple user's freets", function (done) {
            Freet.addFreet("123", "hello world1", moment(), function() {
                Freet.addFreet("456", "hello world2", moment(), function() {
                    Freet.addFreet("456", "hewefllo world2", moment(), function() {
                        Freet.addFreet("456", "hi", moment(), function() {
                            Freet.addFreet("kim", "boohoo", moment(), function() {
                                Freet.getFreetsByAuthor("456", ["123","456"], function(err, result) {
                                    assert.deepEqual(err, null);
                                    assert.deepEqual(result.length,4);
                                    assert.deepEqual(result[0].author,"123");
                                    assert.deepEqual(result[0].text,"hello world1");
                                    assert.deepEqual(result[1].author,"456");
                                    assert.deepEqual(result[1].text,"hello world2");
                                    Freet.clearFreets();
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    //test getFreets
    describe("#getFreets", function () {
        // test getting all the freets
        it("should return all freets", function (done) {
            Freet.addFreet("123", "hello world1", moment(), function() {
                Freet.addFreet("456", "hello world2", moment(), function() {
                    Freet.getFreets("123", function(err, result) {
                        assert.deepEqual(err, null);
                        assert.deepEqual(result.length,2);
                        assert.deepEqual(result[0].author,"123");
                        assert.deepEqual(result[0].text,"hello world1");
                        assert.deepEqual(result[1].author,"456");
                        assert.deepEqual(result[1].text,"hello world2");
                        Freet.clearFreets();
                        done();
                    });
                });
            });
        });
    });

    //test deleteFreetById
    describe("#deleteFreetById", function () {
        // test delete freet authorized user
        it("should succeed when valid id and authorized user", function (done) {
            var id;
            Freet.addFreet("kim", "hello 32world", moment(), function(err, result) {
                id = result.id;
                Freet.getFreets("kim", function(err1, result1) {    
                    Freet.deleteFreetById("Kim", id, function(err2, result2) {
                        Freet.getFreets("kim", function(err, result3) {
                            assert.deepEqual(result1.length,1);
                            assert.deepEqual(err2, null);
                            assert.deepEqual(result3.length,0);
                            Freet.clearFreets();
                            done();
                        });
                    });
                });
            });
        });

        // test delete freet unauthorized user
        it("should fail when valid id and unauthorized user", function (done) {
            var id;
            Freet.addFreet("123", "hello world", moment(), function(err, result) {
                id = result.id;
                Freet.deleteFreetById("456", id, function(err, result) {
                    assert.notDeepEqual(err, null);
                    Freet.clearFreets();
                    done();
                });
            });
        });

        // test delete freet invalid id
        it("should fail when invalid id", function (done) {
            Freet.addFreet("kim", "hello world", moment(), function(){});
            Freet.deleteFreetById("kim", "fakeId", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
            Freet.clearFreets();
        });
    });

});