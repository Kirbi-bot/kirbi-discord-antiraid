const chalk = require('chalk');

const { AntiraidSettings, GuildAntiraidSettingsSchema } = require('../../classes');

module.exports = function (Kirbi) {
	const GuildAntiraidSettings = Kirbi.Database.model('GuildAntiraidSettings', GuildAntiraidSettingsSchema);

	Kirbi.Discord.on('ready', () => {
		GuildAntiraidSettings.find(function (error, guildSettings) {
			if (error) {
				console.log(chalk.red('Error: ' + error));
				return false;
			}

			guildSettings.forEach(settings => {
				const guild = Kirbi.Discord.guilds.find('id', settings.guildId);
				if (guild) {
					Kirbi.antiraidGuilds[settings.guildId] = new AntiraidSettings(guild, settings);
				}
			});

			return true;
		});
	});
};
