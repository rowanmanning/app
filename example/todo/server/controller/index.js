'use strict';

module.exports = function initIndexController(app) {
	const {router} = app;
	const {Todo} = app.models;

	// Create a route for the home page
	router.get('/', async (request, response, next) => {
		try {
			response.render('home', {
				title: 'TODO Example',
				todos: await Todo.find()
			});
		} catch (error) {
			next(error);
		}
	});

};
