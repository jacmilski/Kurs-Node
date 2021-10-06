const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { secretSessionKey } = require('./config');
const helmet = require('helmet');


// init database
require('./db/mongoose');

// session middleware
app.use(session({
    secret: secretSessionKey,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24}, // 1 dzień
    resave: false,
}));

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/../views'));

// set layout
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// public folder
app.use(express.static('public'));

// middleware
app.use(require('./middleware/rate-limiter-middleware'));
app.use(require('./middleware/view-variables-middleware'));
app.use(require('./middleware/user-middleware'));
app.use('/admin', require('./middleware/is-auth-middleware'));
app.use('/firmy', require('./middleware/is-mine-company-middleware'));
app.use('/', express.urlencoded({ extended: true })); // odbiera dane z formularza i zapisuje do body
                                                 // w formacie application/x-www-form-urlencoded
                                                 // urlencoded to rodzaj parsera - dla danych z API byłby to np json()
app.use('/', cookieParser());
app.use(express.json());
app.use(helmet({
    //contentSecurityPolicy: true,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'cdn.jsdelivr.net'],
            styleSrc: ["'self'", 'cdn.jsdelivr.net'],
            imgSrc: ["'self'", 'data:']
        },
    },
}));

// mount routes
app.use('/api', require('./routes/api'));
app.use(require('./routes/web'));

module.exports =  app;