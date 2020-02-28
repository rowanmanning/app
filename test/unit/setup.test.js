'use strict';

const assert = require('proclaim');
const mockery = require('mockery');
const sinon = require('sinon');

sinon.assert.expose(assert, {
	includeFail: false,
	prefix: ''
});

global.setupAllMocking = () => {
	mockery.enable({
		useCleanCache: true,
		warnOnUnregistered: false,
		warnOnReplace: false
	});
};

global.teardownAllMocking = () => {
	mockery.deregisterAll();
	mockery.disable();
	sinon.restore();
};

global.refreshAllMocking = () => {
	global.teardownAllMocking();
	global.setupAllMocking();
};

beforeEach(global.setupAllMocking);
afterEach(global.teardownAllMocking);
