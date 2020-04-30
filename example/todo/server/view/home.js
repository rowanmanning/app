'use strict';

const {html, Partial} = require('../../../..');
const layout = require('./layout/default');

module.exports = function homeView(context) {
	return layout(context, html`

		<h1>${context.title}</h1>

		<form method="post" action="/todo">
			<label for="new-todo-label">Create a TODO</label>
			<input id="new-todo-label" name="label" type="text" autofocus/>
			<input type="submit" value="Create"/>
		</form>

		<ul>
			${context.todos.map(todo => html`
				<li><${Todo} todo=${todo}/></li>
			`)}
		</ul>

	`);
};

class Todo extends Partial {

	render() {
		const {todo} = this.context;
		return html`
			<form
				class="todo ${todo.complete ? 'todo--complete' : ''}"
				method="post"
				action=${todo.complete ? '/todo/uncomplete' : '/todo/complete'}
			>
				<input type="hidden" name="todo" value=${todo.id}/>
				${todo.label}
				<input type="submit" value=${todo.complete ? 'Uncomplete' : 'Complete'}/>
			</form>
		`;
	}

}
