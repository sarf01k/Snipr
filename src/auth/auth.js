const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.cookieAuth = (req, res, next) => {
	if (!req.cookies || !req.cookies.access_token) {
        return res.redirect("/login");
    }

    const token = req.cookies.access_token;

    try {
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
		req.user = user
		console.log(req.user.user._id);
		next()
    } catch (error) {
        res.clearCookie("access_token").status(401).json({ message: "Authentication failed" })
    }
}