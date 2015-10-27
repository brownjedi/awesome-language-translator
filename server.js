'use strict';

// if its not deployed on the server, (i.e., if you are running locally) enable errorhandling
// and set the VCAP_SERVICES environment variable locally
if(!process.env.VCAP_APPLICATION) {
	let vCapServicesJSON = require('./config/vcap_services.json');
	let twilioJSON = require('./config/twilio.json');
	if(vCapServicesJSON)
		process.env.VCAP_SERVICES = JSON.stringify(vCapServicesJSON);

	if(twilioJSON) {
		process.env.TWILIO_ACCOUNT_SID = twilioJSON.TWILIO_ACCOUNT_SID
		process.env.TWILIO_AUTH_TOKEN = twilioJSON.TWILIO_AUTH_TOKEN
	}
}

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const errorhandler = require('errorhandler');
const swig = require('swig');
const path = require('path');

const apiRoutes = require('./routes/apiRoutes');
const viewRoutes = require('./routes/viewRoutes');

let app = express();

app.set('port', process.env.PORT || process.env.VCAP_APP_PORT || 8080);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(cookieParser());

app.use(logger('dev'));
app.use(errorhandler());

app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });

// bootstrap routes
app.use('/api', apiRoutes);
app.use('/', viewRoutes);

// catch 404 and forward it to error handler
app.use((req, res, next) => {
	let err = new Error('404: Not Found. The requested URL does not exist');
	err.status = 400;
	next(err);
});

// Error Handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	return res.json(err.message);
});

// Start the server and listen to the port specified
app.listen(app.get('port'), () => {
	console.log(`Express App listening on Port: ${app.get('port')}`);
});