'use strict';

const td = require('testdouble');

const expressPreactViews = {
	createEngine: td.func(),
	mockViewEngine: {
		isMockViewEngine: true
	}
};

td.when(expressPreactViews.createEngine(), {ignoreExtraArgs: true}).thenReturn(expressPreactViews.mockViewEngine);

module.exports = expressPreactViews;
