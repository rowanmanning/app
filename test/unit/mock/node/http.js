'use strict';

const td = require('testdouble');

const mockAddress = {
	port: 'mock-address-port'
};

const mockServer = {
	address: td.func('http.server.address'),
	close: td.func('http.server.close'),
	listen: td.func('http.server.listen')
};

td.when(mockServer.address(), {ignoreExtraArgs: true}).thenReturn(mockAddress);
td.when(mockServer.listen(), {
	ignoreExtraArgs: true,
	defer: true
}).thenCallback(null);

const createServer = td.func();
td.when(createServer(), {ignoreExtraArgs: true}).thenReturn(mockServer);

module.exports = {
	createServer,
	mockAddress,
	mockServer
};
