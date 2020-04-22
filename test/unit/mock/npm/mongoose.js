'use strict';

const sinon = require('sinon');

const mongoose = {
	createConnection: sinon.stub(),
	Error: {
		ValidationError: 'mock-validation-error'
	},
	Schema: 'mock-schema',
	SchemaType: 'mock-schema-type'
};
mongoose.mockConnection = {
	close: sinon.stub(),
	model: sinon.stub(),
	on: sinon.stub()
};
mongoose.createConnection.returns(mongoose.mockConnection);

module.exports = mongoose;
