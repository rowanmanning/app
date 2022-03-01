'use strict';

const td = require('testdouble');

const renderErrorPage = td.func('renderErrorPage');
renderErrorPage.mockMiddleware = td.func('renderErrorPage middleware');
td.when(renderErrorPage(), {ignoreExtraArgs: true}).thenReturn(renderErrorPage.mockMiddleware);

module.exports = renderErrorPage;
