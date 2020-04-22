'use strict';

const App = require('../..');

// Create a new application
const app = new App({
	basePath: __dirname,
	databaseUrl: 'mongodb://localhost:27017/rowanmanning-app-example-todo',
	name: '@rowanmanning/app: TODO Example',
	sessionSecret: 'todo-example'
});

// Catch setup errors
app.once('setup:error', error => {
	process.exitCode = 1;
	app.log.error(error.stack);
	app.teardown();
});

// Set up the application
app.setup();
