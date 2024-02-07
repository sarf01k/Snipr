const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password || !confirmPassword) {
    		return res.status(400).json({ message: "Please fill all fields" })
    	}

        const existingUser = await User.findOne({ username })

    	if (existingUser) {
    		return res.status(400).json({ message: "User already exists" })
    	}

        if (confirmPassword !== password) {
            return res.status(400).json({ message: "Invalid confirm password" })
        }

        const salt = await bcrypt.genSalt(10);
    	const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            createdAt: new Date().toJSON(),
        });

        const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" })
        user.token = token;
        res.status(200).cookie("access_token", token, {
            httpOnly: true,
        }).redirect("/home");
    } catch (error) {
        console.log(`Error:\n${error}`)
		return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body

        if ( !username || !password ) {
    		return res.status(400).json({ message: "Please fill all fields" })
    	}

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "Account not found" })
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.status(401).json({ message: "Incorrect password" })
        }

        const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "2h" })
        user.token = token;

        res.status(200).cookie("access_token", token, {
            httpOnly: true,
        }).redirect("/home");

    } catch (error) {
        console.log(`Error:\n${error}`)
		res.status(500).json({ message: "Internal server error" })
    }
}

exports.editProfile = async (req, res) => {
    try {
        const { username, email } = req.body;

        if ( !username || !email ) {
    		return res.status(400).json({ message: "Please fill all fields" });
    	}

        const user = await User.findByIdAndUpdate(req.user.user._id, req.body, { new: true });

        if (!user) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        res.status(200).redirect("/settings");

    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

exports.changePassword = async (req, res) => {
    const { password, newPassword, confirmPassword } = req.body;

    if ( !password || !newPassword || !confirmPassword ) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    const match = await bcrypt.compare(password, req.user.user.password)

    if (!match) {
        return res.status(401).json({ message: "Incorrect password" })
    }

    if ( confirmPassword !== newPassword ) {
        return res.status(400).json({ message: "Invalid confirm password" })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(confirmPassword, salt);

    const user = await User.findByIdAndUpdate(req.user.user._id, { password: hashedPassword }, { new: true });

    if (!user) {
        return res.status(404).json({
            message: "Account not found"
        });
    }

    res.status(200).redirect("/settings");
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email || email == "") {
        return res.status(400).json({ message: "Please enter your email" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({message: "Account not found"});
    }

    const secret = process.env.PASSWORD_RESET + user.password;

    const payload = {
        email: user.email,
        id: user._id
    };

    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    console.log("Generated token:", token);
    console.log("User ID:", user._id);

    res.status(200).json({
        token: token,
        id: user._id
    });
}

exports.resetPassword = async (req, res) => {
    const id = req.params.id;
    const token = req.params.token;

    const { newPassword, confirmPassword } = req.body;

    const user = await User.findById(id);

    if (id !== user._id.toString()) {
        return res.status(400).json({ message: "Invalid id" });
    }

    const secret = process.env.PASSWORD_RESET + user.password;

    try {
        const payload = jwt.verify(token, secret);

        if ( !newPassword || !confirmPassword ) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        if ( confirmPassword !== newPassword ) {
            return res.status(400).json({ message: "Invalid confirm password" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(confirmPassword, salt);

        const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

        res.redirect("/login");

    } catch (error) {
        console.log(`Error:\n${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.logout = (req, res) => {
    try {
        res.status(200).clearCookie('access_token').redirect("/");
    } catch (error) {
        console.log(`Error:\n${error}`)
		res.status(500).json({ message: "Error logging out" });
    }
};