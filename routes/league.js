const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/CatchAsync');
const leagues = require('../controllers/league');
const { isLoggedIn, validateLeague } = require('../middleware');

router
	.route('/')
	.get(isLoggedIn, catchAsync(leagues.index))
	.post(isLoggedIn, validateLeague, catchAsync(leagues.createLeague));

router.route('/new-league').get(catchAsync(leagues.renderNewForm));

router.route('/:league').get(catchAsync(leagues.showLeague));

module.exports = router;
