const ExpressError = require('./utils/ExpressError');
const League = require('./models/league');
const { leagueSchema } = require('./schemas.js');

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be signed in first.');
		return res.redirect('/login');
	}
	next();
};

module.exports.validateLeague = (req, res, next) => {
	const { error } = leagueSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isLeagueOwner = async (req, res, next) => {
	const { id } = req.params;
	const league = await League.findById(id);
	if (!league.user.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/baseball/leagues/${id}`);
	}
	next();
};