const express = require("express");
const homeController = require("../controllers/homeController");
const funcs = require("../controllers/sessionController");

const router = express.Router();

router.get("/", homeController.displayHomes);

router.get("/:id", homeController.displayPageOfHome);

router.post("/:id", funcs.requireLogin, homeController.buyOrSellHome);

module.exports = router;