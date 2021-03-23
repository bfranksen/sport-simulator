const Team = require('../../models/baseball/team');

module.exports.index = async (req, res) => {
	const teams = await Team.find({});
	res.render('teams/index', { teams });
};
