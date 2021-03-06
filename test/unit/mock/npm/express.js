'use strict';

const sinon = require('sinon');

const express = sinon.stub();
express.mockApp = {
	enable: sinon.stub(),
	engine: sinon.stub(),
	locals: {},
	set: sinon.stub(),
	use: sinon.stub()
};
express.returns(express.mockApp);

express.mockAddress = {
	port: 'mock-address-port'
};

express.json = sinon.stub();
express.json.mockMiddleware = sinon.stub();
express.json.returns(express.json.mockMiddleware);

express.static = sinon.stub();
express.static.mockMiddleware = sinon.stub();
express.static.returns(express.static.mockMiddleware);

express.urlencoded = sinon.stub();
express.urlencoded.mockMiddleware = sinon.stub();
express.urlencoded.returns(express.urlencoded.mockMiddleware);

module.exports = express;
