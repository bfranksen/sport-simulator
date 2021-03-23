module.exports.index = (req, res) => {
	req.app.locals.sport = req.originalUrl.replace('/', '');
	res.render('sport/index');
};
