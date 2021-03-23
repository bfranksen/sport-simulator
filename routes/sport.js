const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const sport = require('../controllers/sport');

router.route('/').get(sport.index);

module.exports = router;
