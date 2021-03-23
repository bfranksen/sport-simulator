const League = require('../models/league');
const Team = require('../models/baseball/team');

module.exports.index = async (req, res) => {
	req.session.sport = req.originalUrl.replace(new RegExp('/', 'g'), '');
	req.session.sport = req.session.sport.replace('league', '');
	const leagues = await League.find({
		sport: `${req.session.sport}`,
		user: `${req.user._id}`,
	}).populate('team');
	res.locals.sport = req.session.sport;
	res.render('league/index', { leagues: JSON.stringify(leagues) });
};

module.exports.renderNewForm = async (req, res) => {
	const teams = await Team.find({});
	res.render('league/new', { teams });
};

module.exports.createLeague = async (req, res, next) => {
	const league = new League(req.body.league);
	const team = await Team.find({ _id: req.body.league.team });
	league.team = team[0];
	league.startingYear = req.body.league.year;
	league.stage = {
		pointOfSeason: 'Pre-Season',
		currentYear: req.body.league.year,
	};
	league.user = req.user;
	league.sport = req.session.sport;
	await league.save();
	res.redirect(`/${req.session.sport}/league/${league._id}`);
};

module.exports.showLeague = async (req, res) => {
	const param = req.params.league;
	if (param.length > 18) {
		const league = await League.findById(param);
		if (!league) {
			req.flash('error', 'Cannot find that league!');
			res.redirect(`/${req.session.sport}/league`);
		}
		req.session.league = league;
		req.url = `/${req.session.sport}/league/${league.slug}`;
		res.redirect(req.url);
	} else {
		const id = req.session.league._id;
		const league = await League.findById(id);
		if (!league) {
			req.flash('error', 'Cannot find that league!');
			res.redirect(`/${req.session.sport}/league`);
		}
		res.render('league/show', { sport: req.session.sport, league });
	}
};

module.exports.deleteLeague = async (req, res) => {
	const id = req.params.league;
	await League.findByIdAndDelete(id);
	res.redirect(`/${req.session.sport}/league`);
};
