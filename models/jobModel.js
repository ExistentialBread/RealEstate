var mongoose = require("mongoose");

let Schema = mongoose.Schema;

let JobSchema = new Schema({

    name: {
        type: String,
        trim: true,
        required: true,
    },  
    //Time To Complete
    ttc: {
        type: Number,
        required: true,
    },
    pay: {
        type: Number,
        required: true,
    }

});

JobSchema
.virtual("finishTime")
.get(function() {
    return new Date(Date.now() + this.ttc * 1000);
});

JobSchema
.virtual("img")
.get(function() {
    return "/images/" + this.name + ".jpg";
});

module.exports = mongoose.model("Job", JobSchema);