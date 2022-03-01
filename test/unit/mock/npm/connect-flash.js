'use strict';

const td = require('testdouble');

const connectFlash = td.func('connectFlash');
connectFlash.mockMiddleware = td.func('connectFlash middleware');
td.when(connectFlash()).thenReturn(connectFlash.mockMiddleware);

module.exports = connectFlash;
