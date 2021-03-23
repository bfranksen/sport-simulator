const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const exhibition = require('../controllers/exhibition');

router
	.route('/')
	.get(exhibition.index);
	// .post(catchAsync(exhibition.createLeague));

// router.route('/:id').get(catchAsync(exhibition.getLeague));

// router.route('/exhibition/new-league').get(catchAsync(exhibition.renderNewForm));

// router.route('/exhibition/:slug').get(catchAsync(exhibition.showLeague));

module.exports = router;
