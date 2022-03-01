'use strict';

const td = require('testdouble');

const notFound = td.func('notFound');
notFound.mockMiddleware = td.func('notFound middleware');
td.when(notFound(), {ignoreExtraArgs: true}).thenReturn(notFound.mockMiddleware);

module.exports = notFound;
