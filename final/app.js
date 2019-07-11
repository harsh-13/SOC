const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongo')(session);
const dotenv = require('dotenv');

const app = express();

dotenv.config();



//image and css files
app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));
// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose.connect(db, { 
    useNewUrlParser: true,
    useFindAndModify: false })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Connect MongoDBStore to Mongo
const store = new MongoDBStore({
    url: db,
    collection: 'newofficeMarshallSessions',
    clear_interval: 10
});

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// process.env file for session
const TWO_HOUR = 1000 * 60 * 60 * 2;
// const TWO_HOUR = 1000*10;

const {
    NODE_ENV = 'development',
        SESS_NAME = 'officemarshall',
        SESS_SECRET = 'marshallisgreat',
        SESS_LIFETIME = TWO_HOUR,
} = process.env


const IN_PROD = NODE_ENV === 'production';


// Express session
app.use(session({
    name: SESS_NAME,
    store: store,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true, //strict
        secure: IN_PROD,
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/dashboard', require('./routes/dashboard.js'));
app.use('/users', require('./routes/users.js'));
// app.use('/add', require('./routes/add.js'));
// app.use('/docs', require('./routes/docs.js'));
// app.use('/current', require('./routes/current.js'));
// app.use('/view', require('./routes/view.js'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));