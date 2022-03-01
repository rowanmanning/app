'use strict';

const td = require('testdouble');

const expressSession = td.func('expressSession');
expressSession.mockMiddleware = td.func('expressSession middleware');
td.when(expressSession(), {ignoreExtraArgs: true}).thenReturn(expressSession.mockMiddleware);

expressSession.mockStore = {
	isMockSessionStore: true
};
expressSession.Store = td.func();
td.when(new expressSession.Store(), {ignoreExtraArgs: true}).thenReturn(expressSession.mockStore);

module.exports = expressSession;
