const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');

const options = { timestamps: true };

const stageSchema = new Schema(
	{
		pointOfSeason: {
			type: String,
			required: true,
			enum: ['Pre-Season', 'Regular Season', 'Post-Season'],
		},
		currentYear: {
			type: Number,
			required: true,
		},
	},
	{
		_id: false,
	}
);
stageSchema.virtual('getStage').get(function () {
	return `${this.currentYear} - ${pointOfSeason}`;
});

const leagueSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		team: {
			type: Schema.Types.ObjectId,
			ref: 'Team',
		},
		startingYear: {
			type: Number,
			required: true,
		},
		stage: {
			type: stageSchema,
			required: true,
		},
		sport: {
			type: String,
			enum: ['baseball', 'football', 'basketball'],
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	options
);

leagueSchema.virtual('slug').get(function () {
	return slugify(this.name, { lower: true });
});

module.exports = mongoose.model('League', leagueSchema);
