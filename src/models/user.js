const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
		required: true,
		unique: true,
        lowercase: true,
    },
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
	},
	password: {
		type: String,
		required: true,
	}
})

const User = mongoose.model("user", userSchema)

module.exports = User