const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuildAntiraidSettingsSchema = new Schema({
	guildId: String,
	channelId: String,
	seconds: {type: Number, default: 10},
	limit: {type: Number, default: 4}
});

const AntiraidSettings = class antiraidSettings {
	constructor(guild, settings) {
		this.settings = settings;
		this.recentMembers = [];
		this.kicking = false;
	}

	static settingTypes() {
		return {
			channelId: 'string',
			limit: 'int',
			seconds: 'int'
		};
	}
};

module.exports = {
	AntiraidSettings,
	GuildAntiraidSettingsSchema
};
