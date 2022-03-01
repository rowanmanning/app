'use strict';

const td = require('testdouble');

const express = td.func();
express.mockApp = {
	enable: td.func(),
	engine: td.func(),
	locals: {},
	set: td.func(),
	use: td.func()
};
td.when(express(), {ignoreExtraArgs: true}).thenReturn(express.mockApp);

express.mockAddress = {
	port: 'mock-address-port'
};

express.json = td.func('express.json');
express.json.mockMiddleware = td.func('express.json middleware');
td.when(express.json(), {ignoreExtraArgs: true}).thenReturn(express.json.mockMiddleware);

express.static = td.func('express.static');
express.static.mockMiddleware = td.func('express.static middleware');
td.when(express.static(), {ignoreExtraArgs: true}).thenReturn(express.static.mockMiddleware);

express.urlencoded = td.func('express.urlencoded');
express.urlencoded.mockMiddleware = td.func('express.urlencoded middleware');
td.when(express.urlencoded(), {ignoreExtraArgs: true}).thenReturn(express.urlencoded.mockMiddleware);

module.exports = express;
