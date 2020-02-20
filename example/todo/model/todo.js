'use strict';

module.exports = function initTodoModel(app) {
	const {Schema} = app;

	return new Schema({
		label: {
			type: String,
			required: true
		},
		complete: {
			type: Boolean,
			required: true,
			default: false
		}
	});

};
