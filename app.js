if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const device = require('device');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const logger = require('morgan');

const usersRouter = require('./routes/users');
const sportRouter = require('./routes/sport');
// const exhibitionRouter = require('./routes/exhibition');
const leagueRouter = require('./routes/league');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/sportsims';

mongoose.connect(dbUrl, {
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

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(mongoSanitize());
app.use(cookieParser());
app.use(logger('dev'));

const secret = process.env.SECRET || 'thisshouldbeabettersecret';
const store = MongoStore.create({
	mongoUrl: dbUrl,
	secret,
	touchAfter: 60 * 60 * 24,
});
store.on('error', function (err) {
	console.log('Session Store Error', err);
});
const sessionConfig = {
	store,
	name: 'session',
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));
app.use(flash());
// app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.device = device(req.headers['user-agent']).type;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.title = 'SportSims';
	next();
});

app.use('/', usersRouter);
app.use('/baseball', sportRouter);
// app.use('/baseball/exh', exhibitionRouter);
app.use('/baseball/league', leagueRouter);

app.get('/', (req, res) => {
	app.locals.sport = '';
	req.session.league = {};
	res.render('home');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
