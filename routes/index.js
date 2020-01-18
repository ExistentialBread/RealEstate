const express = require("express");
const router = express.Router();

const siteName = "Real Estate";

router.get("/", function(req, res) {

    res.render("index", {title: siteName, sess: req.sess});

});

module.exports = router;