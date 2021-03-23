const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
	res.render('users/register', { leagues: {} });
};

module.exports.register = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash('success', `Welcome to ${res.locals.title}!`);
			res.redirect(`/${req.session.sport}` || '/');
		});
	} catch (e) {
		req.flash('error', e.message);
		console.log(`Error ${e.message}`);
		res.redirect('register');
	}
};

module.exports.renderLogin = (req, res) => {
	res.render('users/login', { leagues: {} });
};

module.exports.login = (req, res) => {
	req.flash('success', `Welcome Back, ${req.user}!`);
	const redirectUrl = req.session.returnTo || `/${req.session.sport}` || '/';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
	req.logout();
	res.redirect('/');
};
