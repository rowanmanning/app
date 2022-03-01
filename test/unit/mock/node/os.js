'use strict';

const td = require('testdouble');

const hostname = td.func();
td.when(hostname(), {ignoreExtraArgs: true}).thenReturn('mock-hostname');

module.exports = {hostname};
