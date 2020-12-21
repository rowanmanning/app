'use strict';

const {h, Component} = require('preact');
const Layout = require('./layout/default');

module.exports = class HomePage extends Component {

	render() {
		const {title} = this.props;
		return (
			<Layout title={title}>
				<h1>{title}</h1>
				<p>Welcome to my site!</p>
			</Layout>
		);
	}

};
