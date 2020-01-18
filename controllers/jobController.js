const Job = require("../models/jobModel");
const User = require("../models/userModel");

exports.joinJob = async function(req, res, next) {
    let user = await User.findById(req.session.userId).exec();
    if (user && !user.job) {
        user.job = req.body.id;
        await user.populate("job").execPopulate();
        user.jobEnd = user.job.finishTime;
        user.save();
        return res.redirect(user.url);
    }
    return next(new Error("Could not give you a job"));
};

exports.finishJob = async function(req, res) {
    let user = await User.findById(req.session.userId)
    .populate("job")
    .exec();
    if (user.timeRemaining <= 0) {
        user.money += user.job.pay;
        user.job = undefined; 
        user.jobEnd = undefined;
        user.save();
    }
    res.redirect(user.url);
}

exports.quitJob = async function(req, res) {
    let user = await User.findById(req.session.userId)
        .populate("job")
        .exec();
    if (user) {
        user.job = undefined;
        user.jobEnd = undefined;
        user.save();
    }
    return res.redirect(user.url);
};

exports.displayJobs = async function(req, res, next) {
    let employed = false;
    let timeLeft;
    let totalTime;
    if (req.session.userId) {
        let user = await User.findById(req.session.userId)
            .populate("job")
            .exec();
        if (user.job) {
            employed = true;
            timeLeft = user.timeRemaining;
            totalTime = user.job.ttc;
        }
    }
    Job.find({}).exec().then(function(jobs) {
        res.render("jobs", {title: "Jobs", sess: req.sess, jobs: jobs, 
            employed:employed, timeLeft: timeLeft, totalTime: totalTime});
    })
    .catch(function(err) {
        next(err);
    });
};