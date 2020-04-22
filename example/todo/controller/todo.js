'use strict';

module.exports = function initIndexController(app) {
	const {router} = app;
	const {Todo} = app.models;

	// Route for TODO creation
	router.post('/todo', async (request, response, next) => {
		try {
			const todo = new Todo({
				label: request.body.label
			});
			await todo.save();
			response.redirect('/');
		} catch (error) {
			next(error);
		}
	});

	// Route for TODO marking as complete
	router.post('/todo/complete', async (request, response, next) => {
		try {
			const todo = await Todo.findById(request.body.todo);
			if (!todo) {
				return next('route');
			}
			todo.complete = true;
			await todo.save();
			response.redirect('/');
		} catch (error) {
			next(error);
		}
	});

	// Route for TODO marking as complete
	router.post('/todo/uncomplete', async (request, response, next) => {
		try {
			const todo = await Todo.findById(request.body.todo);
			if (!todo) {
				return next('route');
			}
			todo.complete = false;
			await todo.save();
			response.redirect('/');
		} catch (error) {
			next(error);
		}
	});

};
