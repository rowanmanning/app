'use strict';

const {Schema} = require('../../..');

module.exports = function initTodoModel() {

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
