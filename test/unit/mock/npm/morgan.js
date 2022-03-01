'use strict';

const td = require('testdouble');

const morgan = td.func('morgan');
morgan.mockMiddleware = td.func('morgan middleware');
td.when(morgan(), {ignoreExtraArgs: true}).thenReturn(morgan.mockMiddleware);

module.exports = morgan;
