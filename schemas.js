const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
	type: 'string',
	base: joi.string(),
	messages: {
		'string.escapeHTML': '{{#label}} must not include HTML!',
	},
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHtml(value, {
					allowedTags: [],
					allowedAttributes: {},
				});
				if (clean !== value)
					return helpers.error('string.escapeHTML', { value });
				return clean;
			},
		},
	},
});

const Joi = BaseJoi.extend(extension);

module.exports.leagueSchema = Joi.object({
	league: Joi.object({
		name: Joi.string().required().min(3).max(18).escapeHTML(),
		year: Joi.number().required(),
		team: Joi.string().required().escapeHTML(),
	}).required(),
});
