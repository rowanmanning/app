'use strict';

const td = require('testdouble');

const MongoStore = {
	create: td.func(),
	mockMongoStore: {
		isMockMongoStore: true
	}
};
td.when(MongoStore.create(), {ignoreExtraArgs: true}).thenReturn(MongoStore.mockMongoStore);

module.exports = MongoStore;
