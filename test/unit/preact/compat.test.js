'use strict';

const assert = require('proclaim');
const compat = require('../../../preact/compat');
const preactCompat = require('preact/compat');

describe('preact/compat', () => {

	it('aliases `preact/compat`', () => {
		assert.strictEqual(compat, preactCompat);
	});

});
