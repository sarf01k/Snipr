const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlSchema = new Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const URL = mongoose.model("url", urlSchema);

module.exports = URL;