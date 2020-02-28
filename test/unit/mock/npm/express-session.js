'use strict';

const sinon = require('sinon');

const expressSession = sinon.stub();
expressSession.mockMiddleware = sinon.stub();
expressSession.returns(expressSession.mockMiddleware);

expressSession.mockStore = {
	isMockSessionStore: true
};
expressSession.Store = sinon.stub().returns(expressSession.mockStore);

module.exports = expressSession;
