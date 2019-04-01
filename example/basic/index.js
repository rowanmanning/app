'use strict';

const App = require('../..');

const app = new App({
	basePath: __dirname,
	name: 'Example App'
});

app.start().catch(error => {
	app.log.error(error.stack);
	process.exitCode = 1;
});
