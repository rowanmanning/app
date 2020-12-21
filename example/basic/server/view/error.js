'use strict';

const {html} = require('../../../..');
const layout = require('./layout/default');

module.exports = function errorView(context) {
	const {error} = context;
	context.title = `Error: ${error.statusCode}`;
	return layout(context, html`
		<h1>${context.title}</h1>
		<p>${error.message}</p>
		<pre>${error.stack}</pre>
	`);
};
