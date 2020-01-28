const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {

    req.sess = false;
    req.session.destroy(function(err) {
        if (err) {next(err);}
        res.redirect("/login");
    });

});

module.exports = router;