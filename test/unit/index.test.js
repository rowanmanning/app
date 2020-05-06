'use strict';

const assert = require('proclaim');
const index = require('../../index');
const App = require('../../lib/app');

describe('index', () => {

	it('aliases `lib/app`', () => {
		assert.strictEqual(index, App);
	});

});
