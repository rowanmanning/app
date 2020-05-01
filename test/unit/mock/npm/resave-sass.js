'use strict';

const sinon = require('sinon');

const resaveSass = sinon.stub();
resaveSass.mockMiddleware = sinon.stub();
resaveSass.returns(resaveSass.mockMiddleware);

module.exports = resaveSass;
