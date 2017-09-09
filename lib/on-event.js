module.exports = function (Kirbi) {
	require('./onEvent/ready')(Kirbi);
	require('./onEvent/guild-member-add')(Kirbi)
};
