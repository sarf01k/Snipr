const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tempUrlSchema = new Schema({
    uniqueId: {
        type: String,
        required: true,
    },
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAfter: {
        type: Date,
        default: Date.now() + 3 * 24 * 60 * 60 * 1000
    }
});

const tempURL = mongoose.model("tempURL", tempUrlSchema);

module.exports = tempURL;