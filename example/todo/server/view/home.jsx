'use strict';

const {h, Component} = require('preact');
const Layout = require('./layout/default');
const Todo = require('./component/todo');

module.exports = class HomePage extends Component {

	render() {
		const {title, todos} = this.props;
		return (
			<Layout title={title}>
				<h1>{title}</h1>

				<form method="post" action="/todo">
					<label for="new-todo-label">Create a TODO</label>
					<input id="new-todo-label" name="label" type="text" autofocus/>
					<input type="submit" value="Create"/>
				</form>

				<ul>
					{todos.map(todo => <li><Todo {...todo}/></li>)}
				</ul>

			</Layout>
		);
	}

};
