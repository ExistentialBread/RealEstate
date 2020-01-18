var async = require('async');
var Home = require('../models/homeModel');
var Job = require('../models/jobModel');


var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://me:YkdA@2hds*2akl@cluster0-b7qdo.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let homes = [];
let jobs = [];

function homeCreate(name, street, city, zip, price, size, cb) {
    homedetail = {name: name, street: street, city: city,
                    zip: zip, price: price, size: size,
                    owned: false};

    let home = new Home(homedetail);

    home.save(function(err) {
        if (err) {
            console.log("Failed to create a home");
            cb(err, null);
            return;
        }
        console.log("New Home: " + home);
        homes.push(home);
        cb(null, home);
    });

} 

function jobCreate(name, length, pay, cb) {
    let job = new Job({name:name, ttc: length, pay: pay});

    job.save(function(err) {

        if (err) {
            console.log("Failed to create jobs!");
            cb(err, null);
            return;
        }
        else {
            console.log("Created job: " + job);
            jobs.push(job);
            cb(null, job);
        }

    });
}

function createJobs(cb) {
    async.series([
        function(callback) {
            jobCreate("Do Laundry", 60, 500, callback)
        },
        function(callback) {
            jobCreate("Mow Lawn", 600, 10000, callback);
        },
        function(callback) {
            jobCreate("Defend Client", 6000, 1000000, callback);
        }
    ], cb);
}

function createHomes(cb) {
    async.series([
        function(callback) {
            homeCreate("Crib", "123 Grove St", "Los Angeles, CA", "90220", 3, 1000, callback);
        },
        function(callback) {
            homeCreate("Yeet", "432 Park Ave", "New York, New York" , "10065", 3000000, 15000, callback);
        },
    ], cb);
}

async.series([
    createHomes,
    createJobs,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Homes: '+ homes);     
        console.log('Jobs: '+ jobs);     
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



