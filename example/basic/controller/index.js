'use strict';

module.exports = app => {

	app.router.get('/', (request, response) => {
		response.render('home', {
			title: app.name
		});
	});

	app.router.get('/500', (request, response, next) => {
		next(new Error('Nope'));
	});

};
