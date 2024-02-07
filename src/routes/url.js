const express = require("express");
const shortid = require("shortid");
const { generateNewShortURL } = require("../controllers/url.js");
const { cookieAuth } = require("../auth/auth.js");
const tempURL = require("../models/temp_url.js");
const URL = require("../models/url.js");
const router = express.Router();

router.post("/", async (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({
            error: "Provide a valid URL"
        })
    }

    const uniqueID = req.cookies.uniqueID || shortid.generate();

    const shortID = shortid.generate();
    const trimmedID = shortID.substring(0, shortID.length - 3);

    try {
        await tempURL.create({
            uniqueId: uniqueID,
            originalUrl,
            shortUrl: trimmedID
        });

        res.status(200).cookie("uniqueID", uniqueID, {
            maxAge: 3 * 24 * 60 * 60 * 1000,
            httpOnly: true
        }).redirect('/');
    } catch (error) {
        console.error("Error:\n", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

router.post("/short-url", cookieAuth, generateNewShortURL);

router.get("/temp/:tempUrl", async (req, res) => {
    const shortUrl = await tempURL.findOne({ shortUrl: req.params.tempUrl });

    if (!shortUrl) {
        return res.sendStatus(404);
    }

    res.redirect(shortUrl.originalUrl);
});

router.get("/:shortUrl", async (req, res) => {
    const shortUrl = await URL.findOne({ shortUrl: req.params.shortUrl });

    if (!shortUrl) {
        return res.sendStatus(404);
    }

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.originalUrl);
});

module.exports = router;