'use strict';

const {html} = require('@rowanmanning/renderer');

module.exports = (context, content) => {
	return html`
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<title>${context.title}</title>
				<link rel="stylesheet" href="/@app/main.css" />
			</head>
			<body className=${context.bodyClassNames}>
				${content}
			</body>
		</html>
	`;
};

