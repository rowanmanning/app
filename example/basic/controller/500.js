'use strict';

module.exports = function initErrorController(app) {
	const {router} = app;

	// Create a route which results in an error being thrown
	router.get('/500', (request, response, next) => {
		next(new Error('Nope'));
	});

};
