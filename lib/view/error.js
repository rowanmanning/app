'use strict';

const {html} = require('../..');
const layout = require('./layout/default');

module.exports = context => {
	return layout(context, html`
		<div class="page page--error">
			<h1>Error ${context.error.status}</h1>
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
