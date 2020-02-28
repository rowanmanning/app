'use strict';

const sinon = require('sinon');

const helmet = sinon.stub();
helmet.mockMiddleware = sinon.stub();
helmet.returns(helmet.mockMiddleware);

module.exports = helmet;
