'use strict';

module.exports = app => {

	app.router.get('/', context => {
		context.render('home', {
			title: app.name
		});
	});

	app.router.get('/500', context => {
		context.throw(500);
	});

};
