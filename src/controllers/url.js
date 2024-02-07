const shortid = require("shortid");
const URL = require("../models/url");

async function generateNewShortURL(req, res) {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({
            error: "Provide a valid URL"
        })
    }

    const shortID = shortid.generate();
    const trimmedID = shortID.substring(0, shortID.length - 3);

    try {
        await URL.create({
            originalUrl,
            shortUrl: trimmedID,
            userId: req.user.user._id
        });

        res.redirect('/home');
    } catch (error) {
        console.error("Error:\n", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

module.exports = { generateNewShortURL };