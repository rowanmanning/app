'use strict';

const sinon = require('sinon');

const flexiBody = sinon.stub();
flexiBody.mockMiddleware = sinon.stub();
flexiBody.returns(flexiBody.mockMiddleware);

module.exports = flexiBody;
