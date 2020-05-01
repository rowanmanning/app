'use strict';

const {html} = require('../../../..');
const layout = require('./layout/default');

module.exports = function homeView(context) {
	return layout(context, html`

		<h1>${context.title}</h1>

		<p>Welcome to my site!</p>

	`);
};