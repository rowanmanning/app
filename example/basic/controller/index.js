'use strict';

module.exports = function initIndexController(app) {
	const {router} = app;

	// Create a route for the home page
	router.get('/', (request, response) => {
		response.render('home', {
			title: 'Basic Example'
		});
	});

};
