const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {

    res.sess = false;
    req.session._id = undefined;
    res.redirect("/login");

});

module.exports = router;