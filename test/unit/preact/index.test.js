'use strict';

const {assert} = require('chai');
const index = require('../../../preact/index');
const preact = require('preact');

describe('preact/index', () => {

	it('aliases `preact`', () => {
		assert.strictEqual(index, preact);
	});

});
