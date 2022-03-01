'use strict';

const td = require('testdouble');

const camelcase = td.func();

td.when(camelcase('first/mock/name')).thenReturn('FirstMockName');
td.when(camelcase('second/mock/name')).thenReturn('SecondMockName');

module.exports = {camelcase};
