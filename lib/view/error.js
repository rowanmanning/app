'use strict';

const {html} = require('../..');
const layout = require('./layout/default');

module.exports = context => {
	context.title = `${context.app.name} Error: ${context.error.statusCode}`;
	return layout(context, html`
		<div class="page page--error">
			<h1>${context.title}</h1>
			<p>${context.error.message}</p>
			<${errorStack} stack=${context.error.stack}/>
		</div>
	`);
};

function errorStack({stack}) {
	return html`
		${stack ? html`<pre class="error-stack">${stack}</pre>` : ''}
	`;
}
