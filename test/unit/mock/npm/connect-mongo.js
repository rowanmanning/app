'use strict';

const td = require('testdouble');

const connectMongo = td.func();
connectMongo.mockMongoStore = {
	isMockMongoStore: true
};
connectMongo.MongoStore = td.func();
td.when(new connectMongo.MongoStore(), {ignoreExtraArgs: true}).thenReturn(connectMongo.mockMongoStore);
td.when(connectMongo(), {ignoreExtraArgs: true}).thenReturn(connectMongo.MongoStore);

module.exports = connectMongo;
