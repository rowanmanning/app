'use strict';

const td = require('testdouble');

const expressHttpToHttps = {
	mockMiddleware: td.func('redirectToHTTPS middleware'),
	redirectToHTTPS: td.func('redirectToHTTPS')
};
td.when(expressHttpToHttps.redirectToHTTPS(), {ignoreExtraArgs: true}).thenReturn(expressHttpToHttps.mockMiddleware);

module.exports = expressHttpToHttps;
