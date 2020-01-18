var mongoose = require("mongoose");

let Schema = mongoose.Schema;

let HomeSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    street: {
        type: String,
        trim: true,
        required: true,
    },
    city: {
        type: String,
        trim: true,
        required: true,
    },
    zip: {
        type: String,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    owned: {
        type: Boolean,
        default: false,
    }
});

HomeSchema
.virtual("address")
.get(function() {
    return this.street + " " + this.city + " " + this.zip;
});

HomeSchema
.virtual("url")
.get(function() {
    return "/inventory/homes/" + this._id;
});

HomeSchema
.virtual("img")
.get(function() {
    return "/images/" + this.name + ".jpg";
});

module.exports = mongoose.model("Home", HomeSchema);