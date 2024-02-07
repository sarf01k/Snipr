const express = require("express");
const jwt = require("jsonwebtoken");
const { login, signUp, logout, editProfile, changePassword, forgotPassword, resetPassword } = require("../controllers/user");
const User = require("../models/user");
const { cookieAuth } = require("../auth/auth");
const URL = require("../models/url");
const router = express.Router();

router.get("/login", async (req, res) => {
    res.render("log_in");
});

router.get("/sign_up", async (req, res) => {
    res.render("sign_up");
});

router.post("/login", login);

router.post("/sign_up", signUp);

router.get("/home", cookieAuth, async (req, res) => {
    const shortUrls = await URL.find({ userId: req.user.user._id });
    res.render("home", { shortUrls: shortUrls });
});

router.get("/settings/account", cookieAuth, async (req, res) => {
    const user = await User.findById(req.user.user._id);
    res.render("account", { user: user });
});

router.get("/settings", cookieAuth, async (req, res) => {
    const user = await User.findById(req.user.user._id);
    res.render("settings", { user: user });
});

router.post("/settings/account", cookieAuth, editProfile);

router.get("/settings/password", cookieAuth, async (req, res) => {
    res.render("password");
});

router.post("/settings/password", cookieAuth, changePassword);

router.get("/forgot-password", async (req,res) => {
    res.render("forgot_password");
});

router.post("/forgot-password", forgotPassword);

router.get("/reset-password/:id/:token", async (req,res) => {
    const { id, token } = req.params;

    const user = await User.findById(id);

    if (id !== user._id.toString()) {
        return res.status(400).json({ message: "Invalid id" });
    }

    // Use a randomly generated secret for JWT verification
    const secret = process.env.PASSWORD_RESET + user.password;

    try {
        const payload = jwt.verify(token, secret);

        res.render("reset_password", { email: user.email });
    } catch (error) {
        console.error(`Error during password reset:\n${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/reset-password/:id/:token", resetPassword);

router.get("/logout", logout);

module.exports = router;