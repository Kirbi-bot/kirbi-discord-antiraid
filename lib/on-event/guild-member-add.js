const chalk = require('chalk');

const { AntiraidSettings, GuildAntiraidSettingsSchema } = require('../../classes');

module.exports = function (Kirbi) {
	const GuildAntiraidSettings = Kirbi.Database.model('GuildAntiraidSettings', GuildAntiraidSettingsSchema);

	Kirbi.Discord.on('guildMemberAdd', member => {
		const guildId = member.guild.id;
		const guild = Kirbi.Discord.guilds.find('id', guildId);
		if (!guild) {
			console.log(chalk.red(`A member joined a guild Kirbi is not a part of ('id': ${guildId})`));
		}

		// Add the server to the list of watched guild
		let antiraidSettings = Kirbi.antiraidGuilds[guildId];
		if (!antiraidSettings) {
			const settings = new GuildAntiraidSettings({
				guildId: guild.id,
				channelId: guild.id
			});
			Kirbi.antiraidGuilds[guildId] = new AntiraidSettings(guild, settings);
			antiraidSettings = Kirbi.antiraidGuilds[guildId];
		}

		// Get the settings for the server
		const guildSettings = antiraidSettings.settings;
		const seconds = guildSettings.seconds;
		const limit = guildSettings.limit;
		const channel = guild.channels.find('id', guildSettings.channelId);

		// Determine if the antiraid needs to be disabled.
		const resetJoinCount = antiraidSettings.recentMembers.length &&
			member.joinedTimestamp - antiraidSettings.recentMembers[antiraidSettings.recentMembers.length - 1].joinedTimestamp > seconds * 1000;

		if (limit && antiraidSettings.recentMembers.length >= limit && !resetJoinCount) {
			// If we haven't started kicking, do so now.
			if (!antiraidSettings.kicking) {
				if (channel) {
					channel.send('Antiraid measures have been activated.');
				}

				antiraidSettings.recentMembers.forEach(recentMember => {
					recentMember.kick('Antiraid protection').then(() => {
						if (channel) {
							channel.send(`${recentMember.user.username}#${recentMember.user.discriminator} was kicked due to antiraid protection.`);
						}
					});
				});

				antiraidSettings.kicking = true;
			}

			// To prevent the array from getting too long, remove the first member and add
			// the last so we only show the people who caused the last threshold to be hit.
			antiraidSettings.recentMembers.shift();
			antiraidSettings.recentMembers.push(member);
			member.kick('Antiraid protection').then(() => {
				if (channel) {
					channel.send(`${member.user.username}#${member.user.discriminator} was kicked due to antiraid protection.`);
				}
			});

			return;
		}

		// Remove all users that are outside the protection timeframe.
		if (resetJoinCount) {
			if (antiraidSettings.kicking && channel) {
				channel.send('Antiraid measures have been deactivated.');
			}

			antiraidSettings.recentMembers = [];
			antiraidSettings.kicking = false;
		}

		// Add the user to recent users and send the greeting.
		antiraidSettings.recentMembers.push(member);

		if (antiraidSettings.settings.welcomeMessage) {
			const message = unescape(antiraidSettings.settings.welcomeMessage)
				.replace('$username', member.user.username)
				.replace('$guildName', member.guild.name);
			member.send(message);
		}

		if (channel) {
			channel.send(`here, please Welcome ${member.user.username} to ${member.guild.name}!`);
		}
	});
};
