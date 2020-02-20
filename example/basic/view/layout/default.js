'use strict';

const {html} = require('../../../..');

module.exports = function defaultLayout(context, content) {
	return html`
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<title>${context.title}</title>
				<link rel="stylesheet" href="/site.css" />
			</head>
			<body>
				${content}
			</body>
		</html>
	`;
};
