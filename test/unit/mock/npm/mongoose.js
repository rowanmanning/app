'use strict';

const sinon = require('sinon');

const mongoose = {
	createConnection: sinon.stub(),
	Schema: 'mock-schema',
	SchemaType: 'mock-schema-type'
};
mongoose.mockConnection = {
	model: sinon.stub()
};
mongoose.createConnection.returns(mongoose.mockConnection);

module.exports = mongoose;
