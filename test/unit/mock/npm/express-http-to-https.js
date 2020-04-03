'use strict';

const sinon = require('sinon');

const expressHttpToHttps = {
	mockMiddleware: sinon.stub(),
	redirectToHTTPS: sinon.stub()
};
expressHttpToHttps.redirectToHTTPS.returns(expressHttpToHttps.mockMiddleware);

module.exports = expressHttpToHttps;
