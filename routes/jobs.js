const express = require("express");
const jobController = require("../controllers/jobController");
const funcs = require("../controllers/sessionController");

const router = express.Router();

router.get("/", jobController.displayJobs);

router.post("/", funcs.requireLogin,jobController.joinJob);

router.post("/quit", funcs.requireLogin, jobController.quitJob);

router.post("/cashIn", funcs.requireLogin, jobController.finishJob);

module.exports = router;