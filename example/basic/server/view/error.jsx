'use strict';

const {h, Component} = require('preact');
const Layout = require('./layout/default');

module.exports = class ErrorPage extends Component {

	render() {
		const {error} = this.props;
		const title = `Error: ${error.statusCode}`;
		return (
			<Layout title={title}>
				<h1>{title}</h1>
				<p>{error.message}</p>
				<pre>{error.stack}</pre>
			</Layout>
		);
	}

};
