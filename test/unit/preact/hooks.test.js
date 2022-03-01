'use strict';

const {assert} = require('chai');
const hooks = require('../../../preact/hooks');
const preactHooks = require('preact/hooks');

describe('preact/hooks', () => {

	it('aliases `preact/hooks`', () => {
		assert.strictEqual(hooks, preactHooks);
	});

});
