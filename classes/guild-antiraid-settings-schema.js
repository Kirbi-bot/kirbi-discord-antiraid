const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = new Schema({
	guildId: String,
	channelId: String,
	seconds: { type: Number, default: 10 },
	limit: { type: Number, default: 4 },
	welcomeMessage: { type: String, default: "Welcome, $username, to the $guildName server!"}
});
