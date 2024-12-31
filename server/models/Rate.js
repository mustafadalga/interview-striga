const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    data: {
        type: Object,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Rate", schema);