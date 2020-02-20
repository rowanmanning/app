'use strict';

const express = require('express');

module.exports = function flexiBody() {

	const json = express.json();
	const urlencoded = express.urlencoded({extended: true});

	return (request, response, next) => {
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			if (request.headers['content-type'] === 'application/json') {
				return json(request, response, next);
			}
			if (request.headers['content-type'] === 'application/x-www-form-urlencoded') {
				return urlencoded(request, response, next);
			}
		}
		next();
	};
};
