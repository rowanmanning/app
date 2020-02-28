'use strict';

const assert = require('proclaim');

describe('index', () => {
	let index;
	let App;

	beforeEach(() => {
		index = require('../../index');
		App = require('../../lib/app');
	});

	it('aliases `lib/app`', () => {
		assert.strictEqual(index, App);
	});

});
