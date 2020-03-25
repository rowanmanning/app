'use strict';

const assert = require('proclaim');
const mockery = require('mockery');
const path = require('path');
const sinon = require('sinon');

describe('lib/app', () => {
	let App;
	let connectMongo;
	let express;
	let helmet;
	let hijackExpressRender;
	let mongoose;
	let morgan;
	let notFound;
	let os;
	let Renderer;
	let renderErrorPage;
	let requireAll;
	let session;
	let varname;

	beforeEach(() => {
		process.env.NODE_ENV = 'test';
		process.env.PORT = 'mock-port';

		connectMongo = require('../mock/npm/connect-mongo');
		mockery.registerMock('connect-mongo', connectMongo);

		express = require('../mock/npm/express');
		mockery.registerMock('express', express);

		helmet = require('../mock/npm/helmet');
		mockery.registerMock('helmet', helmet);

		hijackExpressRender = require('../mock/npm/@rowanmanning/hijack-express-render');
		mockery.registerMock('@rowanmanning/hijack-express-render', hijackExpressRender);

		mongoose = require('../mock/npm/mongoose');
		mockery.registerMock('mongoose', mongoose);

		morgan = require('../mock/npm/morgan');
		mockery.registerMock('morgan', morgan);

		notFound = require('../mock/npm/@rowanmanning/not-found');
		mockery.registerMock('@rowanmanning/not-found', notFound);

		os = require('../mock/node/os');
		mockery.registerMock('os', os);

		Renderer = require('../mock/npm/@rowanmanning/renderer');
		mockery.registerMock('@rowanmanning/renderer', Renderer);

		renderErrorPage = require('../mock/npm/@rowanmanning/render-error-page');
		mockery.registerMock('@rowanmanning/render-error-page', renderErrorPage);

		requireAll = require('../mock/npm/@rowanmanning/require-all');
		mockery.registerMock('@rowanmanning/require-all', requireAll);

		session = require('../mock/npm/express-session');
		mockery.registerMock('express-session', session);

		varname = require('../mock/npm/varname');
		mockery.registerMock('varname', varname);

		App = require('../../../lib/app');
	});

	it('creates a MongoStore using the session middleware', () => {
		assert.calledOnce(connectMongo);
		assert.calledWithExactly(connectMongo, session);
	});

	describe('new App(options)', () => {
		let defaultedOptions;
		let instance;
		let userOptions;

		beforeEach(() => {
			defaultedOptions = {
				basePath: '/mock-base-path',
				controllerSubPath: 'mock-controller-path',
				databaseUrl: 'mock-database-url',
				env: 'mock-env',
				logger: {
					info: sinon.stub(),
					error: sinon.stub(),
					debug: sinon.stub()
				},
				modelSubPath: 'mock-model-path',
				name: 'mock-name',
				port: 'mock-port',
				publicCacheMaxAge: 'mock-cache-max-age',
				publicSubPath: 'mock-public-path',
				requestLogFormat: 'mock-request-log-format',
				requestLogOutputStream: 'mock-request-log-output-stream',
				sessionSecret: 'mock-session-secret',
				trustProxy: 'mock-trust-proxy',
				useSecureCookies: 'mock-use-secure-cookies',
				viewNamespacePaths: 'mock-view-namespace-paths',
				viewSubPath: 'mock-view-path'
			};
			sinon.stub(App, 'applyDefaultOptions').returns(defaultedOptions);
			sinon.stub(App.prototype, 'initDatabase');
			sinon.stub(App.prototype, 'initRenderer');
			sinon.stub(App.prototype, 'initExpress');
			userOptions = {mockUserOptions: true};
			instance = new App(userOptions);
		});

		it('calls `App.applyDefaultOptions` with `options`', () => {
			assert.calledOnce(App.applyDefaultOptions);
			assert.calledWith(App.applyDefaultOptions, userOptions);
		});

		describe('.options', () => {

			it('is set to the defaulted options', () => {
				assert.strictEqual(instance.options, defaultedOptions);
			});

		});

		describe('.name', () => {

			it('is set to the defaulted `name` option', () => {
				assert.strictEqual(instance.name, defaultedOptions.name);
			});

		});

		describe('.env', () => {

			it('is set to the defaulted `env` option', () => {
				assert.strictEqual(instance.env, defaultedOptions.env);
			});

		});

		describe('.log', () => {

			it('is set to the defaulted `logger` option', () => {
				assert.strictEqual(instance.log, defaultedOptions.logger);
			});

		});

		describe('.paths', () => {

			it('is an object', () => {
				assert.isNotNull(instance.paths);
				assert.strictEqual(typeof instance.paths, 'object');
			});

			describe('.base', () => {

				it('is set to the defaulted `basePath` option', () => {
					assert.strictEqual(instance.paths.base, '/mock-base-path');
				});

			});

			describe('.controller', () => {

				it('is set to the resolved `basePath` and `controllerSubPath`', () => {
					assert.strictEqual(instance.paths.controller, '/mock-base-path/mock-controller-path');
				});

			});

			describe('.model', () => {

				it('is set to the resolved `basePath` and `modelSubPath`', () => {
					assert.strictEqual(instance.paths.model, '/mock-base-path/mock-model-path');
				});

			});

			describe('.public', () => {

				it('is set to the resolved `basePath` and `publicSubPath`', () => {
					assert.strictEqual(instance.paths.public, '/mock-base-path/mock-public-path');
				});

			});

			describe('.view', () => {

				it('is set to the resolved `basePath` and `viewSubPath`', () => {
					assert.strictEqual(instance.paths.view, '/mock-base-path/mock-view-path');
				});

			});

		});

		describe('.controllers', () => {

			it('is set to an empty object', () => {
				assert.deepEqual(instance.controllers, {});
			});

		});

		describe('.models', () => {

			it('is set to an empty object', () => {
				assert.deepEqual(instance.models, {});
			});

		});

		describe('.Schema', () => {

			it('aliases `mongoose.Schema`', () => {
				assert.strictEqual(instance.Schema, mongoose.Schema);
			});

		});

		describe('.SchemaType', () => {

			it('aliases `mongoose.SchemaType`', () => {
				assert.strictEqual(instance.SchemaType, mongoose.SchemaType);
			});

		});

		it('calls `instance.initDatabase`', () => {
			assert.calledOnce(instance.initDatabase);
			assert.calledWith(instance.initDatabase);
		});

		it('calls `instance.initRenderer`', () => {
			assert.calledOnce(instance.initRenderer);
			assert.calledWith(instance.initRenderer);
		});

		it('calls `instance.initExpress`', () => {
			assert.calledOnce(instance.initExpress);
			assert.calledWith(instance.initExpress);
		});

		describe('.initDatabase()', () => {

			beforeEach(() => {
				instance.initDatabase.restore();
				sinon.stub(App.prototype, 'initModels');
				instance.initDatabase();
			});

			it('creates a Mongoose connection using `options.databaseUrl`', () => {
				assert.calledOnce(mongoose.createConnection);
				assert.calledWith(mongoose.createConnection, 'mock-database-url', {
					useCreateIndex: true,
					useNewUrlParser: true,
					useUnifiedTopology: true
				});
			});

			it('sets `instance.db` to the created Mongoose connection', () => {
				assert.strictEqual(instance.db, mongoose.createConnection.firstCall.returnValue);
			});

			it('calls `instance.initModels`', () => {
				assert.calledOnce(instance.initModels);
				assert.calledWith(instance.initModels);
			});

			describe('when `options.databaseUrl` is not set', () => {

				beforeEach(() => {
					instance.options.databaseUrl = undefined;
					mongoose.createConnection.resetHistory();
					instance.initModels.resetHistory();
					instance.initDatabase();
				});

				it('does not create a Mognoose connection', () => {
					assert.notCalled(mongoose.createConnection);
				});

				it('does not call `instance.initModels`', () => {
					assert.notCalled(instance.initModels);
				});

			});

		});

		describe('.initModels()', () => {

			beforeEach(() => {
				instance.models = {};
				instance.db = mongoose.mockConnection;
				instance.paths.model = 'mock-instance-model-path';
				requireAll.returns([
					{
						name: 'first/mock/name',
						moduleExports: sinon.stub().returns('FirstMockSchema')
					},
					{
						name: 'second/mock/name',
						moduleExports: sinon.stub().returns('SecondMockSchema')
					}
				]);
				mongoose.mockConnection.model.withArgs('FirstMockName').returns('FirstMockModel');
				mongoose.mockConnection.model.withArgs('SecondMockName').returns('SecondMockModel');
				instance.initModels();
			});

			it('requires all of the models and initialises them', () => {
				assert.calledOnce(requireAll);
				assert.calledWithExactly(requireAll, 'mock-instance-model-path');
				assert.calledOnce(requireAll.firstCall.returnValue[0].moduleExports);
				assert.calledWithExactly(requireAll.firstCall.returnValue[0].moduleExports, instance);
				assert.calledOnce(requireAll.firstCall.returnValue[1].moduleExports);
				assert.calledWithExactly(requireAll.firstCall.returnValue[1].moduleExports, instance);
			});

			it('registers each of the model schemas with Mongoose, camel-casing the names', () => {
				assert.calledTwice(mongoose.mockConnection.model);
				assert.calledWithExactly(mongoose.mockConnection.model, 'FirstMockName', 'FirstMockSchema');
				assert.calledWithExactly(mongoose.mockConnection.model, 'SecondMockName', 'SecondMockSchema');
			});

			it('stores created models on the `models` property', () => {
				assert.strictEqual(instance.models.FirstMockName, 'FirstMockModel');
				assert.strictEqual(instance.models.SecondMockName, 'SecondMockModel');
			});

			describe('when an error occurs during model initialisation', () => {
				let mockError;
				let caughtError;

				beforeEach(() => {
					mockError = new Error('mock error');
					requireAll.throws(mockError);
					try {
						instance.initModels();
					} catch (error) {
						caughtError = error;
					}
				});

				it('throws the error with a modified message', () => {
					assert.strictEqual(caughtError, mockError);
					assert.strictEqual(caughtError.message, 'Models could not be loaded: mock error');
				});

			});

		});

		describe('.initRenderer()', () => {
			let defaultedNamespaceConfig;

			beforeEach(() => {
				instance.paths.view = 'mock-instance-view-path';
				defaultedNamespaceConfig = {
					mockDefaultedConfig: true
				};
				sinon.stub(Object, 'assign').returns(defaultedNamespaceConfig);
				instance.initRenderer.restore();
				instance.initRenderer();
			});

			it('defaults the `namespacePaths` option, adding internal paths', () => {
				assert.calledOnce(Object.assign);
				assert.calledWith(Object.assign, {}, 'mock-view-namespace-paths', {
					'@app': App.internalPaths.view
				});
			});

			it('creates a Renderer instance', () => {
				assert.calledOnce(Renderer);
				assert.calledWithNew(Renderer);
				assert.isObject(Renderer.firstCall.args[0]);
				assert.strictEqual(Renderer.firstCall.args[0].path, 'mock-instance-view-path');
				assert.strictEqual(Renderer.firstCall.args[0].namespacePaths, defaultedNamespaceConfig);
			});

			it('sets `instance.renderer` to the created renderer', () => {
				assert.strictEqual(instance.renderer, Renderer.mockInstance);
			});

		});

		describe('.initExpress()', () => {

			beforeEach(() => {
				instance.db = mongoose.mockConnection;
				instance.renderer = Renderer.mockInstance;
				instance.initControllers = sinon.stub();
				express.static.onCall(0).returns('mock-static-middleware-1');
				express.static.onCall(1).returns('mock-static-middleware-2');
				instance.initExpress.restore();
				instance.initExpress();
			});

			it('creates an Express application', () => {
				assert.calledOnce(express);
				assert.calledWithExactly(express);
			});

			it('sets `instance.express` to the created Express application', () => {
				assert.strictEqual(instance.express, express.firstCall.returnValue);
			});

			it('sets `instance.router` to the created Express application', () => {
				assert.strictEqual(instance.router, express.firstCall.returnValue);
			});

			it('enables case-sensitive routing', () => {
				assert.calledWithExactly(express.mockApp.enable, 'case sensitive routing');
			});

			it('enables strict routing', () => {
				assert.calledWithExactly(express.mockApp.enable, 'strict routing');
			});

			it('sets JSON whitespace to four spaces', () => {
				assert.calledWithExactly(express.mockApp.set, 'json spaces', 4);
			});

			it('does not set the trust proxy option', () => {
				assert.neverCalledWith(express.mockApp.set, 'trust proxy');
			});

			it('hijacks the Express render methods', () => {
				assert.calledOnce(hijackExpressRender);
				assert.calledWith(hijackExpressRender, express.mockApp);
				assert.isFunction(hijackExpressRender.firstCall.args[1]);

				hijackExpressRender.firstCall.args[1]();
				assert.calledOnce(Renderer.mockInstance.render);
			});

			it('creates and mounts Helmet middleware', () => {
				assert.calledOnce(helmet);
				assert.calledWithExactly(helmet);
				assert.calledWith(express.mockApp.use, helmet.mockMiddleware);
			});

			it('creates and mounts URL-encoded body parser middleware', () => {
				assert.calledOnce(express.urlencoded);
				assert.calledWith(express.urlencoded, {
					extended: false
				});
				assert.calledWith(express.mockApp.use, express.urlencoded.mockMiddleware);
			});

			it('creates and mounts JSON body parser middleware', () => {
				assert.calledOnce(express.json);
				assert.calledWith(express.json, {
					strict: false
				});
				assert.calledWith(express.mockApp.use, express.json.mockMiddleware);
			});

			it('creates a Mongo session store', () => {
				assert.calledOnce(connectMongo.MongoStore);
				assert.calledWithNew(connectMongo.MongoStore);
				assert.calledWith(connectMongo.MongoStore, {
					mongooseConnection: mongoose.mockConnection
				});
			});

			it('creates and mounts session middleware', () => {
				assert.calledOnce(session);
				const sessionOptions = session.firstCall.args[0];
				assert.isObject(sessionOptions);
				assert.strictEqual(sessionOptions.name, 'mock-name Session');
				assert.isFalse(sessionOptions.resave);
				assert.isFalse(sessionOptions.saveUninitialized);
				assert.strictEqual(sessionOptions.secret, 'mock-session-secret');
				assert.strictEqual(sessionOptions.store, connectMongo.mockMongoStore);
				assert.calledWith(express.mockApp.use, session.mockMiddleware);
				assert.isObject(sessionOptions.cookie);
				assert.strictEqual(sessionOptions.cookie.sameSite, 'lax');
				assert.strictEqual(sessionOptions.cookie.secure, 'mock-use-secure-cookies');
			});

			it('sets the `app` application local to the application instance', () => {
				assert.strictEqual(express.mockApp.locals.app, instance);
			});

			it('mounts some middleware to add response locals for the current URL and path', () => {
				const setResponseLocals = express.mockApp.use.getCalls().find(call => {
					return (typeof call.args[0] === 'function' && !call.args[0].name);
				}).args[0];
				assert.isFunction(setResponseLocals);
			});

			describe('setResponseLocals(request, response, next)', () => {
				let setResponseLocals;
				let request;
				let response;
				let next;

				beforeEach(() => {
					setResponseLocals = express.mockApp.use.getCalls().find(call => {
						return (typeof call.args[0] === 'function' && !call.args[0].name);
					}).args[0];
					request = {
						url: 'mock-url',
						path: 'mock-path'
					};
					response = {
						locals: {}
					};
					next = sinon.stub();
					setResponseLocals(request, response, next);
				});

				it('sets `response.locals.currentUrl` to `request.url`', () => {
					assert.strictEqual(response.locals.currentUrl, 'mock-url');
				});

				it('sets `response.locals.currentPath` to `request.path`', () => {
					assert.strictEqual(response.locals.currentPath, 'mock-path');
				});

				it('calls `next` with no arguments', () => {
					assert.calledOnce(next);
					assert.calledWithExactly(next);
				});

			});

			it('creates and mounts morgan middleware', () => {
				assert.calledOnce(morgan);
				assert.calledWith(morgan, 'mock-request-log-format');
				assert.isObject(morgan.firstCall.args[1]);
				assert.strictEqual(morgan.firstCall.args[1].stream, 'mock-request-log-output-stream');
				assert.isFunction(morgan.firstCall.args[1].skip);
				assert.calledWith(express.mockApp.use, morgan.mockMiddleware);
			});

			describe('morgan `skip` option: skip(request)', () => {
				let returnValue;
				let skip;

				beforeEach(() => {
					skip = morgan.firstCall.args[1].skip;
					returnValue = skip({
						path: '/'
					});
				});

				it('returns `false`', () => {
					assert.isFalse(returnValue);
				});

				describe('when `request.path` is the default favicon', () => {

					beforeEach(() => {
						returnValue = skip({
							path: '/favicon.ico'
						});
					});

					it('returns `true`', () => {
						assert.isTrue(returnValue);
					});

				});

			});

			it('initialises controllers', () => {
				assert.calledOnce(instance.initControllers);
				assert.calledWithExactly(instance.initControllers);
			});

			it('creates and mounts static middleware', () => {
				assert.calledTwice(express.static);
				assert.calledWith(express.static.firstCall, instance.paths.public, {
					maxAge: 0
				});
				assert.calledWith(express.static.secondCall, App.internalPaths.public, {
					maxAge: 0
				});
				assert.calledWith(express.mockApp.use, 'mock-static-middleware-1');
				assert.calledWith(express.mockApp.use, '/@app', 'mock-static-middleware-2');
			});

			it('creates and mounts notFound middleware', () => {
				assert.calledOnce(notFound);
				assert.calledWithExactly(notFound);
				assert.calledWith(express.mockApp.use, notFound.mockMiddleware);
			});

			it('creates and mounts renderErrorPage middleware', () => {
				assert.calledOnce(renderErrorPage);
				assert.isObject(renderErrorPage.firstCall.args[0]);
				assert.isFunction(renderErrorPage.firstCall.args[0].errorLogger);
				assert.deepEqual(renderErrorPage.firstCall.args[0].errorView, ['error', '@app:error']);
				assert.isTrue(renderErrorPage.firstCall.args[0].includeErrorStack);
				assert.calledWith(express.mockApp.use, renderErrorPage.mockMiddleware);
			});

			describe('renderErrorPage `errorLogger` option: errorLogger(error)', () => {
				let errorLogger;

				beforeEach(() => {
					errorLogger = renderErrorPage.firstCall.args[0].errorLogger;
					const error = new Error('mock error');
					error.name = 'MockErrorName';
					error.stack = 'mock error\n  mock stack line 1\n  mock stack line 2';
					instance.log.error.resetHistory();
					errorLogger(error);
				});

				it('logs a string version of the error', () => {
					assert.calledOnce(instance.log.error);
					assert.calledWithExactly(instance.log.error, 'MockErrorName: mock error {"stack":"mock stack line 1\\nmock stack line 2"}');
				});

				describe('when `error.name` is falsy', () => {

					beforeEach(() => {
						const error = {
							message: 'mock error',
							stack: 'mock error\n  mock stack line 1\n  mock stack line 2'
						};
						instance.log.error.resetHistory();
						errorLogger(error);
					});

					it('logs a string version of the error', () => {
						assert.calledOnce(instance.log.error);
						assert.calledWithExactly(instance.log.error, 'Error: mock error {"stack":"mock stack line 1\\nmock stack line 2"}');
					});

				});

			});

			describe('when `options.env` is "production"', () => {

				beforeEach(() => {
					instance.env = 'production';
					express.static.resetHistory();
					renderErrorPage.resetHistory();
					instance.initExpress();
				});

				it('sets the trust proxy option', () => {
					assert.calledWithExactly(express.mockApp.set, 'trust proxy', 'mock-trust-proxy');
				});

				it('creates static middleware with the configured `publicCacheMaxAge` option', () => {
					assert.calledTwice(express.static);
					assert.strictEqual(express.static.firstCall.args[1].maxAge, 'mock-cache-max-age');
					assert.strictEqual(express.static.secondCall.args[1].maxAge, 'mock-cache-max-age');
				});

				it('creates renderErrorPage middleware without including the error stack', () => {
					assert.calledOnce(renderErrorPage);
					assert.isFalse(renderErrorPage.firstCall.args[0].includeErrorStack);
				});

			});

			describe('when `options.databaseUrl` is not set', () => {

				beforeEach(() => {
					delete instance.options.databaseUrl;
					connectMongo.MongoStore.resetHistory();
					session.Store.resetHistory();
					session.resetHistory();
					instance.initExpress();
				});

				it('does not create a Mongo session store', () => {
					assert.notCalled(connectMongo.MongoStore);
				});

				it('creates an in-memory session store', () => {
					assert.calledOnce(session.Store);
					assert.calledWithNew(session.Store);
					assert.calledWithExactly(session.Store);
				});

				it('creates session middleware with the in-memory store', () => {
					assert.calledOnce(session);
					assert.strictEqual(session.firstCall.args[0].store, session.mockStore);
				});

			});

			describe('when `options.sessionSecret` is not set', () => {

				beforeEach(() => {
					delete instance.options.sessionSecret;
					connectMongo.MongoStore.resetHistory();
					session.Store.resetHistory();
					express.mockApp.use.resetHistory();
					session.resetHistory();
					instance.initExpress();
				});

				it('does not create a Mongo session store', () => {
					assert.notCalled(connectMongo.MongoStore);
				});

				it('does not create an in-memory session store', () => {
					assert.notCalled(session.Store);
				});

				it('does not create or mount session middleware', () => {
					assert.notCalled(session);
					assert.neverCalledWith(express.mockApp.use, session.mockMiddleware);
				});

				it('logs an error to explain that sessions are not configured', () => {
					assert.calledWith(instance.log.error, '[setup]: missing "sessionSecret" option, sessions are not set up');
				});

			});

			describe('when `options.requestLogFormat` is not set', () => {

				beforeEach(() => {
					delete instance.options.requestLogFormat;
					morgan.resetHistory();
					express.mockApp.use.resetHistory();
					instance.initExpress();
				});

				it('does not create or mount morgan middleware', () => {
					assert.notCalled(morgan);
					assert.neverCalledWith(express.mockApp.use, morgan.mockMiddleware);
				});

			});

		});

		describe('.initControllers()', () => {

			beforeEach(() => {
				instance.controllers = {};
				instance.db = mongoose.mockConnection;
				instance.paths.controller = 'mock-instance-controller-path';
				requireAll.returns([
					{
						name: 'first/mock/name',
						moduleExports: sinon.stub().returns('FirstMockController')
					},
					{
						name: 'second/mock/name',
						moduleExports: sinon.stub().returns('SecondMockController')
					}
				]);
				instance.initControllers();
			});

			it('requires all of the controllers, camel-casing the names and initialising them', () => {
				assert.calledOnce(requireAll);
				assert.calledWithExactly(requireAll, 'mock-instance-controller-path');
				assert.calledOnce(requireAll.firstCall.returnValue[0].moduleExports);
				assert.calledWithExactly(requireAll.firstCall.returnValue[0].moduleExports, instance);
				assert.calledOnce(requireAll.firstCall.returnValue[1].moduleExports);
				assert.calledWithExactly(requireAll.firstCall.returnValue[1].moduleExports, instance);
			});

			it('stores initialised controllers on the `controllers` property, camel-casing the names', () => {
				assert.deepEqual(instance.controllers.FirstMockName, 'FirstMockController');
				assert.deepEqual(instance.controllers.SecondMockName, 'SecondMockController');
			});

			describe('when an error occurs during model initialisation', () => {
				let mockError;
				let caughtError;

				beforeEach(() => {
					mockError = new Error('mock error');
					requireAll.throws(mockError);
					try {
						instance.initControllers();
					} catch (error) {
						caughtError = error;
					}
				});

				it('throws the error with a modified message', () => {
					assert.strictEqual(caughtError, mockError);
					assert.strictEqual(caughtError.message, 'Controllers could not be loaded: mock error');
				});

			});

		});

		describe('.start()', () => {
			let returnValue;

			beforeEach(async () => {
				delete instance.server;
				instance.express = express.mockApp;
				os.hostname.returns('mock-os-hostname');
				express.mockAddress.port = 'mock-express-address-port';
				returnValue = await instance.start();
			});

			it('returns the application instance', () => {
				assert.strictEqual(returnValue, instance);
			});

			it('starts the Express application listening on the given `port` option', () => {
				assert.calledOnce(express.mockApp.listen);
				assert.calledWith(express.mockApp.listen, 'mock-port');
			});

			it('stores the created HTTP server on the `server` property', () => {
				assert.strictEqual(instance.server, express.mockServer);
			});

			it('logs that the application has started', () => {
				assert.calledWith(instance.log.info, '[lifecycle]: started successfully http://mock-os-hostname:mock-express-address-port');
			});

			describe('when `instance.server` is already set', () => {
				let caughtError;

				beforeEach(async () => {
					instance.log.info.resetHistory();
					express.mockApp.listen.resetHistory();
					instance.server = express.mockServer;
					try {
						await instance.start();
					} catch (error) {
						caughtError = error;
					}
				});

				it('does not attempt to start the Express application', () => {
					assert.notCalled(express.mockApp.listen);
				});

				it('does log that the application has started', () => {
					assert.notCalled(instance.log.info);
				});

				it('throws an error', () => {
					assert.isInstanceOf(caughtError, Error);
					assert.strictEqual(caughtError.message, 'Application has already been started');
				});

			});

			describe('when listening on the port fails', () => {
				let caughtError;
				let mockError;

				beforeEach(async () => {
					mockError = new Error('mock error');
					express.mockApp.listen.yieldsAsync(mockError);
					instance.log.info.resetHistory();
					delete instance.server;
					try {
						await instance.start();
					} catch (error) {
						caughtError = error;
					}
				});

				it('logs that the application has failed to start', () => {
					assert.calledWith(instance.log.error, '[lifecycle]: failed to start');
				});

				it('does not log that the application has started', () => {
					assert.notCalled(instance.log.info);
				});

				it('throws the error', () => {
					assert.strictEqual(caughtError, mockError);
				});

			});

		});

		describe('.stop()', () => {
			let returnValue;

			beforeEach(async () => {
				instance.server = express.mockServer;
				returnValue = await instance.stop();
			});

			it('returns the application instance', () => {
				assert.strictEqual(returnValue, instance);
			});

			it('stops the server', () => {
				assert.calledOnce(express.mockServer.close);
			});

			it('deletes the `server` property', () => {
				assert.isUndefined(instance.server);
			});

			it('logs that the application has stopped', () => {
				assert.calledWith(instance.log.info, '[lifecycle]: stopped successfully');
			});

			describe('when `instance.server` is not set', () => {
				let caughtError;

				beforeEach(async () => {
					instance.log.info.resetHistory();
					express.mockServer.close.resetHistory();
					delete instance.server;
					try {
						await instance.stop();
					} catch (error) {
						caughtError = error;
					}
				});

				it('does not attempt to stop the server', () => {
					assert.notCalled(express.mockServer.close);
				});

				it('does log that the application has stopped', () => {
					assert.notCalled(instance.log.info);
				});

				it('throws an error', () => {
					assert.isInstanceOf(caughtError, Error);
					assert.strictEqual(caughtError.message, 'Application has not been started');
				});

			});

			describe('when stopping the server fails', () => {
				let caughtError;
				let mockError;

				beforeEach(async () => {
					mockError = new Error('mock error');
					express.mockServer.close.yieldsAsync(mockError);
					instance.server = express.mockServer;
					instance.log.info.resetHistory();
					try {
						await instance.stop();
					} catch (error) {
						caughtError = error;
					}
				});

				it('logs that the application has failed to stop', () => {
					assert.calledWith(instance.log.error, '[lifecycle]: failed to stop');
				});

				it('does not log that the application has started', () => {
					assert.notCalled(instance.log.info);
				});

				it('throws the error', () => {
					assert.strictEqual(caughtError, mockError);
				});

			});

		});

	});

	describe('.defaultOptions', () => {

		it('is an object', () => {
			assert.isNotNull(App.defaultOptions);
			assert.strictEqual(typeof App.defaultOptions, 'object');
		});

		describe('.basePath', () => {

			it('is set to the current working directory', () => {
				assert.strictEqual(App.defaultOptions.basePath, process.cwd());
			});

		});

		describe('.controllerSubPath', () => {

			it('is set to "controller"', () => {
				assert.strictEqual(App.defaultOptions.controllerSubPath, 'controller');
			});

		});

		describe('.databaseUrl', () => {

			it('is set to `null`', () => {
				assert.isNull(App.defaultOptions.databaseUrl);
			});

		});

		describe('.env', () => {

			it('is set to the `NODE_ENV` environment variable', () => {
				assert.strictEqual(App.defaultOptions.env, process.env.NODE_ENV);
			});

			describe('when `NODE_ENV` is not set', () => {

				beforeEach(() => {
					global.refreshAllMocking();
					delete process.env.NODE_ENV;
					App = require('../../../lib/app');
				});

				it('is set to "development"', () => {
					assert.strictEqual(App.defaultOptions.env, 'development');
				});

			});

		});

		describe('.logger', () => {

			it('is set to `console`', () => {
				assert.strictEqual(App.defaultOptions.logger, console);
			});

		});

		describe('.modelSubPath', () => {

			it('is set to "model"', () => {
				assert.strictEqual(App.defaultOptions.modelSubPath, 'model');
			});

		});

		describe('.name', () => {

			it('is set to "App"', () => {
				assert.strictEqual(App.defaultOptions.name, 'App');
			});

		});

		describe('.port', () => {

			it('is set to the `PORT` environment variable', () => {
				assert.strictEqual(App.defaultOptions.port, process.env.PORT);
			});

			describe('when `PORT` is not set', () => {

				beforeEach(() => {
					global.refreshAllMocking();
					delete process.env.PORT;
					App = require('../../../lib/app');
				});

				it('is set to `8080`', () => {
					assert.strictEqual(App.defaultOptions.port, 8080);
				});

			});

		});

		describe('.publicCacheMaxAge', () => {

			it('is set to one week in milliseconds', () => {
				assert.strictEqual(App.defaultOptions.publicCacheMaxAge, 604800000);
			});

		});

		describe('.publicSubPath', () => {

			it('is set to "public"', () => {
				assert.strictEqual(App.defaultOptions.publicSubPath, 'public');
			});

		});

		describe('.requestLogFormat', () => {

			it('is set to `undefined`', () => {
				assert.isUndefined(App.defaultOptions.requestLogFormat);
			});

		});

		describe('.requestLogOutputStream', () => {

			it('is set to `process.stdout`', () => {
				assert.strictEqual(App.defaultOptions.requestLogOutputStream, process.stdout);
			});

		});

		describe('.sessionSecret', () => {

			it('is set to `null`', () => {
				assert.isNull(App.defaultOptions.sessionSecret);
			});

		});

		describe('.trustProxy', () => {

			it('is set to `true`', () => {
				assert.isTrue(App.defaultOptions.trustProxy);
			});

		});

		describe('.useSecureCookies', () => {

			it('is set to `undefined`', () => {
				assert.isUndefined(App.defaultOptions.useSecureCookies);
			});

		});

		describe('.viewNamespacePaths', () => {

			it('is set to an empty object', () => {
				assert.deepEqual(App.defaultOptions.viewNamespacePaths, {});
			});

		});

		describe('.viewSubPath', () => {

			it('is set to "view"', () => {
				assert.strictEqual(App.defaultOptions.viewSubPath, 'view');
			});

		});

	});

	describe('.internalPaths', () => {

		it('is an object', () => {
			assert.isNotNull(App.internalPaths);
			assert.strictEqual(typeof App.internalPaths, 'object');
		});

		describe('.public', () => {

			it('is set to the expected file path', () => {
				const expectedPath = path.resolve(__dirname, '../../../lib/public');
				assert.strictEqual(App.internalPaths.public, expectedPath);
			});

		});

		describe('.view', () => {

			it('is set to the expected file path', () => {
				const expectedPath = path.resolve(__dirname, '../../../lib/view');
				assert.strictEqual(App.internalPaths.view, expectedPath);
			});

		});

	});

	describe('.html', () => {

		it('aliases `Renderer.html`', () => {
			assert.strictEqual(App.html, Renderer.html);
		});

	});

	describe('.Partial', () => {

		it('aliases `Renderer.Partial`', () => {
			assert.strictEqual(App.Partial, Renderer.Partial);
		});

	});

	describe('.applyDefaultOptions(options)', () => {
		let defaultedOptions;
		let expectedOptions;
		let returnValue;
		let userOptions;

		beforeEach(() => {
			userOptions = {mockUserOptions: true};
			defaultedOptions = {
				env: 'mock-env',
				requestLogFormat: 'mock-request-log-format',
				trustProxy: 'mock-trust-proxy',
				useSecureCookies: 'mock-use-secure-cookies',
				mockDefaultedOptions: true
			};
			expectedOptions = {
				env: 'mock-env',
				requestLogFormat: 'mock-request-log-format',
				trustProxy: 'mock-trust-proxy',
				useSecureCookies: 'mock-use-secure-cookies',
				mockDefaultedOptions: true
			};
			sinon.stub(Object, 'assign').returns(defaultedOptions);
			returnValue = App.applyDefaultOptions(userOptions);
		});

		it('defaults the `options`', () => {
			assert.calledOnce(Object.assign);
			assert.calledWith(Object.assign, {}, App.defaultOptions, App.defaultOptions, userOptions);
		});

		it('returns the defaulted options with some transformations', () => {
			assert.deepEqual(returnValue, expectedOptions);
		});

		describe('when `options.requestLogFormat` is not defined', () => {

			beforeEach(() => {
				delete defaultedOptions.requestLogFormat;
			});

			describe('and `options.env` is "production"', () => {

				beforeEach(() => {
					defaultedOptions.env = 'production';
					returnValue = App.applyDefaultOptions(userOptions);
				});

				it('sets `options.requestLogFormat` to "combined"', () => {
					assert.strictEqual(returnValue.requestLogFormat, 'combined');
				});

			});

			describe('and `options.env` is "development"', () => {

				beforeEach(() => {
					defaultedOptions.env = 'development';
					returnValue = App.applyDefaultOptions(userOptions);
				});

				it('sets `options.requestLogFormat` to "dev"', () => {
					assert.strictEqual(returnValue.requestLogFormat, 'dev');
				});

			});

		});

		describe('when `options.useSecureCookies` is not defined', () => {

			beforeEach(() => {
				delete defaultedOptions.useSecureCookies;
			});

			describe('and `options.env` is "production"', () => {

				beforeEach(() => {
					defaultedOptions.env = 'production';
					returnValue = App.applyDefaultOptions(userOptions);
				});

				it('sets `options.useSecureCookies` to `true`', () => {
					assert.isTrue(returnValue.useSecureCookies);
				});

			});

			describe('and `options.env` is "development"', () => {

				beforeEach(() => {
					defaultedOptions.env = 'development';
					returnValue = App.applyDefaultOptions(userOptions);
				});

				it('sets `options.useSecureCookies` to `false`', () => {
					assert.isFalse(returnValue.useSecureCookies);
				});

			});

		});

	});

});
