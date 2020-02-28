'use strict';

const sinon = require('sinon');

const morgan = sinon.stub();
morgan.mockMiddleware = sinon.stub();
morgan.returns(morgan.mockMiddleware);

module.exports = morgan;
