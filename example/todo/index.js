'use strict';

const App = require('../..');

// Create a new application
const app = new App({
	basePath: __dirname,
	databaseUrl: 'mongodb://localhost:27017/rowanmanning-app-example-todo',
	name: '@rowanmanning/app: TODO Example',
	sessionSecret: 'todo-example'
});

// Start the application
app.start().catch(error => {
	app.log.error(error.stack);
	process.exitCode = 1;
});
