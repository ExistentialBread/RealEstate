var session = require("express-session");
var User = require("../models/userModel");
var ObjectId = require("mongoose").ObjectId;

module.exports.checkSess = 
function(req, res, next) {
    if (req.session && req.session.userId) {
        req.sess = true;
    }
    else {
        req.sess = false;
    }
    return next();

}

module.exports.requireLogin = 
function(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    return next();

}