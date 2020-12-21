'use strict';

const {h, Component} = require('preact');

module.exports = class Todo extends Component {

	render() {
		const {complete, id, label} = this.props;
		return (
			<form
				method="post"
				action={complete ? '/todo/uncomplete' : '/todo/complete'}
				className={`todo ${complete ? 'todo--complete' : ''}`}
			>
				<input type="hidden" name="todo" value={id}/>
				{label}
				<input type="submit" value={complete ? 'Uncomplete' : 'Complete'}/>
			</form>
		);
	}

};
