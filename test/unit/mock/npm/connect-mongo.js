'use strict';

const sinon = require('sinon');

const connectMongo = sinon.stub();
connectMongo.mockMongoStore = {
	isMockMongoStore: true
};
connectMongo.MongoStore = sinon.stub().returns(connectMongo.mockMongoStore);
connectMongo.returns(connectMongo.MongoStore);

module.exports = connectMongo;
