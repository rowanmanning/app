'use strict';

const sinon = require('sinon');

class Server {}
Server.prototype.listen = sinon.stub();

const mockAddress = {
	port: 'mock-address-port'
};

const mockServer = {
	address: sinon.stub().returns(mockAddress),
	close: sinon.stub(),
	listen: sinon.stub().yieldsAsync(null)
};

module.exports = {
	createServer: sinon.stub().returns(mockServer),
	mockAddress,
	mockServer
};
