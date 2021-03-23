const mongoose = require('mongoose');
const { Schema } = mongoose;

const options = { toJSON: { virtuals: true } };

const teamSchema = new Schema(
	{
		nickname: {
			type: String,
			required: true,
			unique: true,
		},
		city: {
			type: String,
			required: true,
			unique: true,
		},
		state: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
		acronym: {
			type: String,
			required: true,
			unique: true,
		},
	},
	options
);

teamSchema.virtual('teamName').get(function () {
	return `${this.city} ${this.nickname}`;
});

module.exports = mongoose.model('Team', teamSchema);
