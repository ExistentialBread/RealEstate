var mongoose = require("mongoose");

let Schema = mongoose.Schema;

let userSchema = new Schema({

    username: {
        type: String,
        trim: true,
        min: "4",
        max: "16",
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    money: {
        type: Number,
        default: 1500000,
    },
    homes: [{type: Schema.Types.ObjectId, ref: "Home"}],
    job: {
        type: Schema.Types.ObjectId, 
        ref: "Job",
    },
    jobEnd: {
        type: Date,
    }

});

userSchema
.virtual("timeRemaining")
.get(function() {
    return (this.jobEnd - new Date())/1000;
});

userSchema
.virtual("url")
.get(function() {
    return "/profile/" + this._id;
});

module.exports = mongoose.model("User", userSchema);