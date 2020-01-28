const express = require("express");
const userController = require("../controllers/userController");
const funcs = require("../controllers/sessionController");

const router = express.Router();

router.get("/:id", funcs.requireLogin, userController.display);

router.get("/", funcs.requireLogin, function(req, res) {
    res.redirect("/profile/" + req.session.userId);
});

module.exports = router;