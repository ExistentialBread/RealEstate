var mongoose = require("mongoose");

var mongoDB = "mongodb+srv://me:YkdA@2hds*2akl@cluster0-b7qdo.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.dropDatabase();

mongoose.connection.close();