'use strict';

const App = require('../..');

// Create a new application
const app = new App({
	basePath: __dirname,
	name: '@rowanmanning/app: Basic Example'
});

// Start the application
app.start().catch(error => {
	app.log.error(error.stack);
	process.exitCode = 1;
});
