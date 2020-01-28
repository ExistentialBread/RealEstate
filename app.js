//Import modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const createError = require("http-errors");

const funcs = require("./controllers/sessionController");
const indexRouter = require("./routes/index");
const inventoryRouter = require("./routes/inventory");
const jobsRouter = require("./routes/jobs");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const profileRouter = require("./routes/profile");
const MongoStore = require("connect-mongo")(session);

const mongoDB = "mongodb+srv://me:YkdA@2hds*2akl@cluster0-b7qdo.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();

//Set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "Butt Stallion",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: db})
}));
app.use(funcs.checkSess);

Number.prototype.toTime = 
function() {
    let hours = Math.floor(this / 3600);
    let minutes = Math.floor((this % 3600) / 60);
    let seconds = Math.floor((this % 3600) % 60);
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ":" + minutes + ":" + seconds;
};

//Use routes
app.use("/", indexRouter);
app.use("/inventory", inventoryRouter);
app.use("/jobs", jobsRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/profile", profileRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

//Error Handling
app.use(function(err, req, res, next) {
    
    console.log(err.stack)
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    
    res.sendStatus(err.status || 500);
    
});

module.exports = app;