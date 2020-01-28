const User = require("../models/userModel");
const hash = require("bcryptjs");
const validator = require("express-validator");

const invalid = "is-invalid";
const notInvalid = "";
const title = "Login";

exports.login = async function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let userValid = notInvalid;
    let passwordValid = notInvalid;
    
    let user;
    try {
        user = await User.findOne({username: username}).exec();
    }
    catch (err) {
        next(err);
    }
    if (user) {
        try {
            if (await hash.compare(password, user.password)) {
                req.session.userId = user._id;
                return res.redirect(user.url);
            }
        }
        catch (err) {
            throw err;
        }
        passwordValid = invalid;
    }
    else {userValid = invalid;}

    res.render("login", {title: title, sess: req.sess, userValid: userValid, passwordValid: passwordValid});
};

exports.signup = [
    validator.body("username", "username").isEmail().isLength({min:6, max:30}).trim().escape()
        .custom(async (value, {req, loc, path}) => {
            try {
                let result = await User.findOne({username: value});
                if (result) {
                    throw new Error("username");
                }
                return value;
            }
            catch (err) {
                throw err;
            }
        }),
    validator.body("password", "password").isLength({min:4, max:20}),
    validator.body("passwordConfirm", "passwordConfirm").isLength({min:4, max:20})
        .custom((value, {req, loc, path}) => {
            if (value != req.body.password) {
                throw new Error("passwordConfirm");
            }
            return value;
        }),
    async function(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        let usernameValid = notInvalid;
        let passwordValid = notInvalid;
        let passwordConfirmValid = notInvalid;

        
        try {
            let errs = validator.validationResult(req).array();      
            let passwordHashed = await hash.hash(password, 10);
            let user = new User({
                username: username,
                password: passwordHashed
            });

            if (errs.length != 0) {
                if (errs.some(obj => obj.msg === "passwordConfirm")) {
                    passwordConfirmValid = invalid;
                }
                if (errs.some(obj => obj.msg === "password")) {
                    passwordValid = invalid;
                }
                if (errs.some(obj => obj.msg === "username")) {
                    usernameValid = invalid;
                }
                return res.render("login", {title: title, sess: req.sess, 
                    userValid: usernameValid, 
                    passwordValid: passwordValid,
                    passwordConfirmValid: passwordConfirmValid,
                    signup: "true"});
            }
            await user.save();
            req.session.userId = user._id;
            return res.redirect(user.url);
        }
        catch (err) {
            throw err;
        }
    }
];

exports.display = function(req, res, next) {
    User.findOne({_id: req.session.userId})
    .populate("homes")
    .populate("job")
    .exec()
    .then(function(user) {
        res.render("profile", {
                title:"Your Profile",
                sess: req.sess, 
                user: user,
                inventory: user.homes});
    })
    .catch(err => next(err));
}
