'use strict';

const td = require('testdouble');

const mongoose = {
	createConnection: td.func(),
	Error: {
		ValidationError: 'mock-validation-error'
	},
	Schema: 'mock-schema',
	SchemaType: 'mock-schema-type'
};
mongoose.mockConnection = {
	close: td.func(),
	model: td.func(),
	on: td.func()
};
td.when(mongoose.createConnection(), {ignoreExtraArgs: true}).thenReturn(mongoose.mockConnection);

module.exports = mongoose;
