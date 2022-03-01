'use strict';

const td = require('testdouble');

const requireAll = td.func();
td.when(requireAll(), {ignoreExtraArgs: true}).thenReturn([]);

module.exports = requireAll;
