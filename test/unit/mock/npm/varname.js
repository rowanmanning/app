'use strict';

const sinon = require('sinon');
const varname = require('varname');

module.exports = {
	camelcase: sinon.spy(varname.camelcase)
};
