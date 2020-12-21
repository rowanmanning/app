'use strict';

const {h, Component} = require('preact');

module.exports = class Layout extends Component {

	render() {
		return (
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<title>{this.props.title}</title>
					<link rel="stylesheet" href="/main.css" />
				</head>
				<body>
					{this.props.children}
				</body>
			</html>
		);
	}

};
