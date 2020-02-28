'use strict';

const sinon = require('sinon');

const renderErrorPage = sinon.stub();
renderErrorPage.mockMiddleware = sinon.stub();
renderErrorPage.returns(renderErrorPage.mockMiddleware);

module.exports = renderErrorPage;
