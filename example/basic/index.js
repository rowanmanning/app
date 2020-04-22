'use strict';

const App = require('../..');

// Create a new application
const app = new App({
	basePath: __dirname,
	name: '@rowanmanning/app: Basic Example'
});

// Catch setup errors
app.once('setup:error', error => {
	process.exitCode = 1;
	app.log.error(error.stack);
	app.teardown();
});

// Set up the application
app.setup();
