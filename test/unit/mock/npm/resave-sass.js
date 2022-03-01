'use strict';

const td = require('testdouble');

const resaveSass = td.func('resaveSass');
resaveSass.mockMiddleware = td.func('resaveSass middleware');
td.when(resaveSass(), {ignoreExtraArgs: true}).thenReturn(resaveSass.mockMiddleware);

module.exports = resaveSass;
