require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');

require('./models/connection');

var usersRouter = require('./routes/users');
var alertsRouter = require('./routes/alerts');
var firstRespondersRouter = require('./routes/firstResponders');
var healthRecordsRouter = require('./routes/healthRecords');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/alerts', alertsRouter);
app.use('/firstResponders', firstRespondersRouter);
app.use('/healthRecords', healthRecordsRouter);

module.exports = app;
