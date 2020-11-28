'use strict';

module.exports = {
	extends: '@rowanmanning/eslint-config/es2017',
	rules: {
		'callback-return': 'off',
		complexity: [
			'warn',
			{
				max: 10
			}
		],
		'max-statements': [
			'warn',
			{
				max: 35
			}
		]
	}
};
