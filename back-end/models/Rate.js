const mongoose = require("mongoose");
const { mongoDBDocumentID } = require("../constants");

const schema = new mongoose.Schema({
    _id: {
        type: String,
        default: mongoDBDocumentID,
    },
    data: {
        type: Object,
        required: true,
    },
});

module.exports = mongoose.model("Rate", schema);