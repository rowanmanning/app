'use strict';

const sinon = require('sinon');

const expressPreactViews = {
	createEngine: sinon.stub(),
	mockViewEngine: {
		isMockViewEngine: true
	}
};

expressPreactViews.createEngine.returns(expressPreactViews.mockViewEngine);

module.exports = expressPreactViews;
