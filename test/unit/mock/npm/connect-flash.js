'use strict';

const sinon = require('sinon');

const connectFlash = sinon.stub();
connectFlash.mockMiddleware = sinon.stub();
connectFlash.returns(connectFlash.mockMiddleware);

module.exports = connectFlash;
