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
	getClient: td.func(),
	model: td.func(),
	on: td.func()
};
td.when(mongoose.createConnection(), {ignoreExtraArgs: true}).thenReturn(mongoose.mockConnection);
td.when(mongoose.mockConnection.getClient()).thenReturn('mock-mongoose-client');

module.exports = mongoose;
