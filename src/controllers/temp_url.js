const shortid = require("shortid");
const tempURL = require("../models/url")

exports.generateTempShortURL = async (req, res) => {
    const { originalUrl } = req.body;
    console.log("Received originalUrl:", originalUrl);

    if (!originalUrl) {
        return res.status(400).json({
            error: "Provide a valid URL"
        })
    }

    const shortID = shortid.generate();
    const trimmedID = shortID.substring(0, shortID.length - 3);

    try {
        await tempURL.create({
            originalUrl,
            shortUrl: trimmedID
        });

        res.redirect('/');
    } catch (error) {
        console.error("Error:\n", error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}