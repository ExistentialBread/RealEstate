const Home = require("../models/homeModel");
const User = require("../models/userModel");
const ObjectId = require("mongodb").ObjectID;

buyHome = function(req, res, next) {
    return new Promise(async function(resolve, reject) {
        let homeId = req.params.id;
        let home = await Home.findById(homeId).exec();
        let user = await User.findById(req.session.userId).exec();

        if (home === null || home === undefined) {
            return reject("Could not find home");
        }
        if (home.owned) {
            return reject("Home already owned");
        }
        if (home.price > user.money) {
            return reject("Not enough money. Stop being poor and work for us!");
        }
        await Home.findByIdAndUpdate(home._id, {owned:true}).exec();
        user.homes.push(home._id);
        user.money -= home.price;
        await user.save();
        resolve(home);
    });
}; 

sellHome = function(req, res, next) {
    return new Promise(async function(resolve, reject) {
        let homeId = req.params.id;
        let user = await User.findById(req.session.userId).populate("homes");
        let home = user.homes.find(val => val._id == homeId);

        if (home === null || home === undefined) {
            return reject("Could not find home");
        }
        if (!home.owned) {
            return reject("Home is not owned");
        }
        await Home.findByIdAndUpdate(home._id, {owned:false}).exec();
        user.homes.splice(user.homes.indexOf(home._id), 1);
        user.money += home.price;
        await user.save();
        resolve(home);
    });
}; 

exports.buyOrSellHome = async function(req, res, next) {
    try {
        if (req.body.buySell === "Buy") {
            await buyHome(req, res, next);
        }
        else {
            await sellHome(req, res, next);
        }
        res.redirect("/profile/" + req.session.userId);
    }
    catch (err) {
        req.homeTransactionError = err;
        displayPageOfHome(req, res);
    }
}

exports.displayHomes = async function(req, res) {
    let inventory = Home.find({owned: false}).exec();
    res.render("inventory", {title: "Browse", sess: req.sess, inventory: await inventory});
}; 


async function displayPageOfHome(req, res) {
    let homeInfo;
    let owned = false;
    try {
        let id = req.params.id;
        homeInfo = await Home.findOne({"_id": ObjectId(id)}).exec();
        if (!homeInfo) {
            throw "Home not found";
        }

        if (req.session.userId) {
            let userObj = 
                    await User.
                    find({"_id" : ObjectId(req.session.userId)}, {"homes" : 1, "_id": 0}).
                    populate("homes").
                    populate("job").
                    exec();
            let homesArray = userObj[0].homes;
            homesArray.forEach(home => {
                if (home._id == id) {
                    owned = true;
                }
            });
            if (req.homeTransactionError) {
                throw req.homeTransactionError;
            }
        }
        res.render("homepage", {title: homeInfo.name, sess: req.sess, home: homeInfo, owned: owned});
    }
    catch (err) {
        if (homeInfo) {
            res.render("homepage", {title: homeInfo.name, sess: req.sess, home: homeInfo, owned: owned, errMsg: err});
        }
        else {
            res.render("homepage", {title: "HomeError", sess: req.sess, owned: owned, errMsg: err});
        }
    }
}; 

exports.displayPageOfHome = displayPageOfHome;