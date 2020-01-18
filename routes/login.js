const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

const notInvalid = "";

router.get("/", function(req, res) {

    res.render("login", {title:"Login", userValid: notInvalid, passwordValid: notInvalid});

});

router.post("/", function(req, res, next) {
    
    if (req.body.loginSignUpButton === "Login") {
        return next();
    }
    return next("route");

}, userController.login);

router.post("/", userController.signup);

module.exports = router;