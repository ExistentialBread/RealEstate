const express = require("express");
const homeController = require("../controllers/homeController");
const router = express.Router();
const funcs = require("../controllers/sessionController");


const siteName = "Real Estate";

router.get("/", homeController.displayHomes);

router.get("/:id", homeController.displayPageOfHome);

router.post("/:id", funcs.requireLogin, homeController.buyOrSellHome);

module.exports = router;