const mongoose = require('mongoose');
const cities = require('./cities');
const helpers = require('./helpers');
const Team = require('../../models/baseball/team');

mongoose.connect('mongodb://localhost:27017/sportsims', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
	console.log(`Database Connected: ${db.name}`);
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const makeAcronym = (nickname, city) => {
	let acr = '';
	const citySpaceIndex = city.indexOf(' ');
	const nameSpaceIndex = nickname.indexOf(' ');
	if (citySpaceIndex !== -1) {
		acr =
			city.substring(0, 1) +
			city.substring(citySpaceIndex + 1, citySpaceIndex + 2) +
			nickname.substring(0, 1);
	} else if (nameSpaceIndex !== -1) {
		acr =
			city.substring(0, 1) +
			nickname.substring(0, 1) +
			nickname.substring(nameSpaceIndex + 1, nameSpaceIndex + 2);
	} else {
		acr = city.substring(0, 3).toUpperCase();
	}
	return acr;
};

const createTeam = () => {
	const nickname = `${sample(helpers.names)}`;
	const random = Math.floor(Math.random() * 100);
	const city = `${cities[random].city}`;
	const state = `${cities[random].state}`;
	const acronym = makeAcronym(nickname, city);

	const team = new Team({
		nickname,
		city,
		state,
		country: 'USA', // may add international locations in the future
		acronym,
	});

	return team;
};

const checkNumStates = async (state) => {
	return await Team.find({ state }).countDocuments();
};

const seedDB = async () => {
	await Team.deleteMany({});
	let numTeams = 0;
	while (numTeams < 30) {
		const team = createTeam();
		if ((await checkNumStates(team.state)) < 4) {
			await team
				.save()
				.then(() => {
					numTeams++;
				})
				.catch((e) => {
					console.log(`Duplication Error (${numTeams})`, e.keyValue);
				});
		}
	}

	const teams = await Team.find({});
	for (let team of teams) {
		console.log(team);
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
