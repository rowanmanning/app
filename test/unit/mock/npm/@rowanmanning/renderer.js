'use strict';

const sinon = require('sinon');

const Renderer = sinon.stub();
Renderer.mockInstance = {
	render: sinon.stub()
};
Renderer.returns(Renderer.mockInstance);

Renderer.html = sinon.stub();

Renderer.mockPartial = {};
Renderer.Partial = sinon.stub().returns(Renderer.mockPartial);

module.exports = Renderer;
