const mongoose = require("mongoose");

module.exports = mongoose.model("Order", mongoose.Schema({
    items: {
        type: Number
    },
    price: Number,
    from: String
}));