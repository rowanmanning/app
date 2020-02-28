'use strict';

const sinon = require('sinon');

const notFound = sinon.stub();
notFound.mockMiddleware = sinon.stub();
notFound.returns(notFound.mockMiddleware);

module.exports = notFound;
