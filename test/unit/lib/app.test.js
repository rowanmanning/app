'use strict';

const assert = require('proclaim');
const mockery = require('mockery');
const path = require('path');
const sinon = require('sinon');

describe('lib/app', () => {
	let App;
	let connectMongo;
	let EventEmitter;
	let express;
	let expressHttpToHttps;
	let helmet;
	let hijackExpressRender;
	let http;
	let mongoose;
	let morgan;
	let notFound;
	let os;
	let Renderer;
	let renderErrorPage;
	let requireAll;
	let resaveSass;
	let session;
	let varname;

	beforeEach(() => {
		process.env.NODE_ENV = 'test';
		process.env.PORT = 'mock-port';

		connectMongo = require('../mock/npm/connect-mongo');
		mockery.registerMock('connect-mongo', connectMongo);

		EventEmitter = require('../mock/node/events');
		mockery.registerMock('events', EventEmitter);

		express = require('../mock/npm/express');
		mockery.registerMock('express', express);

		expressHttpToHttps = require('../mock/npm/express-http-to-https');
		mockery.registerMock('express-http-to-https', expressHttpToHttps);

		helmet = require('../mock/npm/helmet');
		mockery.registerMock('helmet', helmet);

		hijackExpressRender = require('../mock/npm/@rowanmanning/hijack-express-render');
		mockery.registerMock('@rowanmanning/hijack-express-render', hijackExpressRender);

		http = require('../mock/node/http');
		mockery.registerMock('http', http);

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

		resaveSass = require('../mock/npm/resave-sass');
		mockery.registerMock('resave-sass', resaveSass);

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
				enforceHttps: true,
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
				sassSubPath: 'mock-sass-path',
				sassBundles: 'mock-sass-bundles',
				sessionSecret: 'mock-session-secret',
				trustProxy: 'mock-trust-proxy',
				useSecureCookies: 'mock-use-secure-cookies',
				viewNamespacePaths: 'mock-view-namespace-paths',
				viewSubPath: 'mock-view-path'
			};
			sinon.stub(App, 'applyDefaultOptions').returns(defaultedOptions);
			userOptions = {mockUserOptions: true};
			instance = new App(userOptions);
		});

		it('extends EventEmitter', () => {
			assert.isInstanceOf(instance, EventEmitter);
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

			describe('.sass', () => {

				it('is set to the resolved `basePath` and `sassSubPath`', () => {
					assert.strictEqual(instance.paths.sass, '/mock-base-path/mock-sass-path');
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

		describe('.setup()', () => {
			let returnValue;

			beforeEach(() => {
				sinon.stub(App.prototype, 'setupDatabase');
				sinon.stub(App.prototype, 'setupRenderer');
				sinon.stub(App.prototype, 'setupExpress');
				sinon.stub(App.prototype, 'startServer');
				returnValue = instance.setup();
			});

			it('calls `instance.setupDatabase`', () => {
				assert.calledOnce(instance.setupDatabase);
				assert.calledWith(instance.setupDatabase);
			});

			it('calls `instance.setupRenderer`', () => {
				assert.calledOnce(instance.setupRenderer);
				assert.calledWith(instance.setupRenderer);
			});

			it('calls `instance.setupExpress`', () => {
				assert.calledOnce(instance.setupExpress);
				assert.calledWith(instance.setupExpress);
			});

			it('calls `instance.startServer`', () => {
				assert.calledOnce(instance.startServer);
				assert.calledWith(instance.startServer);
			});

			it('calls the init methods in the expected order', () => {
				assert.callOrder(
					instance.setupDatabase,
					instance.setupRenderer,
					instance.setupExpress,
					instance.startServer
				);
			});

			it('returns the instance', () => {
				assert.strictEqual(returnValue, instance);
			});

			describe('when one of the called methods throws an error', () => {
				let caughtError;
				let mockError;

				beforeEach(() => {
					mockError = new Error('mock error');
					App.prototype.startServer.throws(mockError);
					try {
						returnValue = instance.setup();
					} catch (error) {
						caughtError = error;
					}
				});

				it('does not throw the error', () => {
					assert.isUndefined(caughtError);
				});

				it('emits a `setup:error` event, passing the error to that', () => {
					assert.calledOnce(instance.emit);
					assert.calledWithExactly(instance.emit, 'setup:error', mockError);
				});

				it('returns the instance', () => {
					assert.strictEqual(returnValue, instance);
				});

			});

		});

		describe('.setupDatabase()', () => {

			beforeEach(() => {
				sinon.stub(App.prototype, 'setupModels');
				instance.setupDatabase();
			});

			it('creates a Mongoose connection using `options.databaseUrl`', () => {
				assert.calledOnce(mongoose.createConnection);
				assert.calledWith(mongoose.createConnection, 'mock-database-url', {
					useCreateIndex: true,
					useFindAndModify: false,
					useNewUrlParser: true,
					useUnifiedTopology: true
				});
			});

			it('sets `instance.db` to the created Mongoose connection', () => {
				assert.strictEqual(instance.db, mongoose.createConnection.firstCall.returnValue);
			});

			it('listens for the connection `connected` event', () => {
				assert.calledOnce(instance.db.on);
				assert.isFunction(instance.db.on.firstCall.args[1]);
			});

			describe('instance.db `connected` handler', () => {

				beforeEach(() => {
					instance.emit.resetHistory();
					instance.db.on.firstCall.args[1]();
				});

				it('logs that the database has connected', () => {
					assert.calledWithExactly(instance.log.debug, '[setup:database]: connected');
				});

				it('emits a `database:connected` event', () => {
					assert.calledOnce(instance.emit);
					assert.calledWithExactly(instance.emit, 'database:connected');
				});

			});

			it('calls `instance.setupModels`', () => {
				assert.calledOnce(instance.setupModels);
				assert.calledWith(instance.setupModels);
			});

			it('calls everything in the expected order', () => {
				assert.callOrder(
					mongoose.createConnection,
					instance.db.on,
					instance.setupModels
				);
			});

			describe('when `options.databaseUrl` is not set', () => {

				beforeEach(() => {
					instance.options.databaseUrl = undefined;
					mongoose.createConnection.resetHistory();
					instance.setupModels.resetHistory();
					instance.setupDatabase();
				});

				it('does not create a Mognoose connection', () => {
					assert.notCalled(mongoose.createConnection);
				});

				it('does not call `instance.setupModels`', () => {
					assert.notCalled(instance.setupModels);
				});

				it('logs an error to explain that the database has not been set up', () => {
					assert.calledWithExactly(instance.log.error, '[setup:database]: missing "databaseUrl" option, database not set up');
				});

			});

		});

		describe('.setupModels()', () => {

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
				instance.setupModels();
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

			it('logs that each model has been initialised', () => {
				assert.calledWithExactly(instance.log.debug, '[setup:models]: "FirstMockName" model initialised');
				assert.calledWithExactly(instance.log.debug, '[setup:models]: "SecondMockName" model initialised');
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
						instance.setupModels();
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

		describe('.setupRenderer()', () => {
			let defaultedNamespaceConfig;

			beforeEach(() => {
				instance.paths.view = 'mock-instance-view-path';
				defaultedNamespaceConfig = {
					mockDefaultedConfig: true
				};
				sinon.stub(Object, 'assign').returns(defaultedNamespaceConfig);
				instance.setupRenderer();
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

		describe('.setupExpress()', () => {

			beforeEach(() => {
				instance.db = mongoose.mockConnection;
				instance.renderer = Renderer.mockInstance;
				instance.setupControllers = sinon.stub();
				instance.setupClientAssetCompilation = sinon.stub();
				express.static.onCall(0).returns('mock-static-middleware-1');
				express.static.onCall(1).returns('mock-static-middleware-2');
				instance.setupExpress();
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

			it('creates an HTTP server with the created Express application', () => {
				assert.calledOnce(http.createServer);
				assert.calledWithExactly(http.createServer, instance.express);
			});

			it('sets `instance.server` to the created HTTP server', () => {
				assert.strictEqual(instance.server, http.createServer.firstCall.returnValue);
			});

			it('emits a `server:created` event, passing the server to that', () => {
				assert.calledOnce(instance.emit);
				assert.calledWithExactly(instance.emit, 'server:created', instance.server);
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

			it('creates and mounts redirectToHTTPS middleware', () => {
				assert.calledOnce(expressHttpToHttps.redirectToHTTPS);
				assert.calledWith(express.mockApp.use, expressHttpToHttps.mockMiddleware);
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

			it('sets `instance.sessionMiddleware` to the created session middleware', () => {
				assert.strictEqual(instance.sessionMiddleware, session.mockMiddleware);
			});

			it('logs that sessions have been set up', () => {
				assert.calledWithExactly(instance.log.info, '[setup:sessions]: sessions set up successfully');
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
				assert.calledOnce(instance.setupControllers);
				assert.calledWithExactly(instance.setupControllers);
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

			it('initialises client-side asset compilation', () => {
				assert.calledOnce(instance.setupClientAssetCompilation);
				assert.calledWithExactly(instance.setupClientAssetCompilation);
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
				assert.isFunction(renderErrorPage.firstCall.args[0].errorLoggingFilter);
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

			describe('renderErrorPage `errorLoggingFilter` option: errorLoggingFilter(error)', () => {
				let errorLoggingFilter;
				let returnValue;

				beforeEach(() => {
					errorLoggingFilter = renderErrorPage.firstCall.args[0].errorLoggingFilter;
					const error = new Error('mock error');
					returnValue = errorLoggingFilter(error);
				});

				it('returns `true`', () => {
					assert.isTrue(returnValue);
				});

				describe('when `error.status` is 500 or greater', () => {

					beforeEach(() => {
						const error = new Error('mock error');
						error.status = 500;
						returnValue = errorLoggingFilter(error);
					});

					it('returns `true`', () => {
						assert.isTrue(returnValue);
					});

				});

				describe('when `error.status` is 499 or lower', () => {

					beforeEach(() => {
						const error = new Error('mock error');
						error.status = 499;
						returnValue = errorLoggingFilter(error);
					});

					it('returns `false`', () => {
						assert.isFalse(returnValue);
					});

				});

				describe('when `error.statusCode` is 500 or greater', () => {

					beforeEach(() => {
						const error = new Error('mock error');
						error.statusCode = 500;
						returnValue = errorLoggingFilter(error);
					});

					it('returns `true`', () => {
						assert.isTrue(returnValue);
					});

				});

				describe('when `error.statusCode` is 499 or lower', () => {

					beforeEach(() => {
						const error = new Error('mock error');
						error.statusCode = 499;
						returnValue = errorLoggingFilter(error);
					});

					it('returns `false`', () => {
						assert.isFalse(returnValue);
					});

				});

			});

			it('calls everything in the expected order', () => {
				assert.callOrder(
					express,
					http.createServer,
					hijackExpressRender,
					instance.express.use.withArgs(helmet.mockMiddleware),
					instance.express.use.withArgs(expressHttpToHttps.mockMiddleware),
					instance.express.use.withArgs(express.urlencoded.mockMiddleware),
					instance.express.use.withArgs(express.json.mockMiddleware),
					instance.express.use.withArgs(session.mockMiddleware),
					instance.express.use.withArgs(morgan.mockMiddleware),
					instance.express.use.withArgs('mock-static-middleware-1'),
					instance.express.use.withArgs('/@app', 'mock-static-middleware-2'),
					instance.express.use.withArgs(notFound.mockMiddleware),
					instance.express.use.withArgs(renderErrorPage.mockMiddleware)
				);
			});

			describe('when `options.env` is "production"', () => {

				beforeEach(() => {
					instance.env = 'production';
					express.static.resetHistory();
					renderErrorPage.resetHistory();
					instance.setupExpress();
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
					instance.setupExpress();
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

			describe('when `options.enforceHttps` is `false`', () => {

				beforeEach(() => {
					instance.options.enforceHttps = false;
					expressHttpToHttps.redirectToHTTPS.resetHistory();
					express.mockApp.use.resetHistory();
					instance.setupExpress();
				});

				it('does not create and mount redirectToHTTPS middleware', () => {
					assert.notCalled(expressHttpToHttps.redirectToHTTPS);
					assert.neverCalledWith(express.mockApp.use, expressHttpToHttps.mockMiddleware);
				});

			});

			describe('when `options.sessionSecret` is not set', () => {

				beforeEach(() => {
					delete instance.options.sessionSecret;
					connectMongo.MongoStore.resetHistory();
					session.Store.resetHistory();
					express.mockApp.use.resetHistory();
					session.resetHistory();
					instance.setupExpress();
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
					assert.calledWith(instance.log.error, '[setup:sessions]: missing "sessionSecret" option, sessions not set up');
				});

			});

			describe('when `options.requestLogFormat` is not set', () => {

				beforeEach(() => {
					delete instance.options.requestLogFormat;
					morgan.resetHistory();
					express.mockApp.use.resetHistory();
					instance.setupExpress();
				});

				it('does not create or mount morgan middleware', () => {
					assert.notCalled(morgan);
					assert.neverCalledWith(express.mockApp.use, morgan.mockMiddleware);
				});

			});

		});

		describe('.setupControllers()', () => {

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
				instance.setupControllers();
			});

			it('requires all of the controllers, camel-casing the names and initialising them', () => {
				assert.calledOnce(requireAll);
				assert.calledWithExactly(requireAll, 'mock-instance-controller-path');
				assert.calledOnce(requireAll.firstCall.returnValue[0].moduleExports);
				assert.calledWithExactly(requireAll.firstCall.returnValue[0].moduleExports, instance);
				assert.calledOnce(requireAll.firstCall.returnValue[1].moduleExports);
				assert.calledWithExactly(requireAll.firstCall.returnValue[1].moduleExports, instance);
			});

			it('logs that each controller has been initialised', () => {
				assert.calledWithExactly(instance.log.debug, '[setup:controllers]: "FirstMockName" controller initialised');
				assert.calledWithExactly(instance.log.debug, '[setup:controllers]: "SecondMockName" controller initialised');
			});

			it('stores initialised controllers on the `controllers` property, camel-casing the names', () => {
				assert.deepEqual(instance.controllers.FirstMockName, 'FirstMockController');
				assert.deepEqual(instance.controllers.SecondMockName, 'SecondMockController');
			});

			describe('when an error occurs during controller initialisation', () => {
				let mockError;
				let caughtError;

				beforeEach(() => {
					mockError = new Error('mock error');
					requireAll.throws(mockError);
					try {
						instance.setupControllers();
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

		describe('.setupClientAssetCompilation()', () => {

			beforeEach(() => {
				express.mockApp.use.resetHistory();
				instance.router = express.mockApp;
				instance.setupClientAssetCompilation();
			});

			it('creates and mounts Resave Sass middleware, opting not to save compiled files', () => {
				assert.calledOnce(resaveSass);
				assert.isObject(resaveSass.firstCall.args[0]);
				assert.strictEqual(resaveSass.firstCall.args[0].basePath, '/mock-base-path/mock-sass-path');
				assert.strictEqual(resaveSass.firstCall.args[0].bundles, 'mock-sass-bundles');
				assert.isFunction(resaveSass.firstCall.args[0].log.error);
				assert.isFunction(resaveSass.firstCall.args[0].log.info);
				assert.isNull(resaveSass.firstCall.args[0].savePath);
				assert.calledWith(express.mockApp.use, resaveSass.mockMiddleware);
			});

			it('uses bound logging functions in the Resave Sass configuration', () => {
				instance.log.error.resetHistory();
				instance.log.info.resetHistory();
				resaveSass.firstCall.args[0].log.error('mock error');
				assert.calledOnce(instance.log.error);
				assert.calledWithExactly(instance.log.error, '[assets:sass]:', 'mock error');
				resaveSass.firstCall.args[0].log.info('mock info');
				assert.calledOnce(instance.log.info);
				assert.calledWithExactly(instance.log.info, '[assets:sass]:', 'mock info');
			});

			describe('when `options.env` is "production"', () => {

				beforeEach(() => {
					instance.env = 'production';
					resaveSass.resetHistory();
					instance.setupClientAssetCompilation();
				});

				it('creates and mounts Resave Sass middleware, saving compiled files', () => {
					assert.calledOnce(resaveSass);
					assert.isObject(resaveSass.firstCall.args[0]);
					assert.strictEqual(resaveSass.firstCall.args[0].savePath, '/mock-base-path/mock-public-path');
				});

			});

		});

		describe('.startServer()', () => {

			beforeEach(() => {
				instance.server = http.mockServer;
				instance.server.listen.yields();
				os.hostname.returns('mock-os-hostname');
				http.mockAddress.port = 'mock-server-address-port';
				instance.startServer();
			});

			it('starts the HTTP server listening on the given `port` option', () => {
				assert.calledOnce(instance.server.listen);
				assert.calledWith(instance.server.listen, 'mock-port');
				assert.isFunction(instance.server.listen.firstCall.args[1]);
			});

			it('logs that the server has started', () => {
				assert.calledWith(instance.log.info, '[setup:server]: started successfully http://mock-os-hostname:mock-server-address-port');
			});

			it('emits a `server:started` event, passing the server to that', () => {
				assert.calledOnce(instance.emit);
				assert.calledWithExactly(instance.emit, 'server:started', instance.server);
			});

			describe('when listening on the port fails', () => {
				let caughtError;
				let mockError;

				beforeEach(() => {
					instance.emit.resetHistory();
					mockError = new Error('mock error');
					instance.server.listen.yields(mockError);
					instance.log.info.resetHistory();
					try {
						instance.startServer();
					} catch (error) {
						caughtError = error;
					}
				});

				it('logs that the application has failed to start', () => {
					assert.calledWith(instance.log.error, '[setup:server]: failed to start');
				});

				it('does not log that the application has started', () => {
					assert.notCalled(instance.log.info);
				});

				it('does not emit a `server:started` event', () => {
					assert.neverCalledWith(instance.emit, 'server:started', instance.server);
				});

				it('does not throw the error', () => {
					assert.isUndefined(caughtError);
				});

				it('emits a `setup:error` event, passing the error to that', () => {
					assert.calledOnce(instance.emit);
					assert.calledWithExactly(instance.emit, 'setup:error', mockError);
				});

			});

		});

		describe('.teardown()', () => {

			beforeEach(() => {
				instance.server = http.mockServer;
				instance.db = mongoose.mockConnection;
				instance.teardown();
			});

			it('closes the server connection', () => {
				assert.calledOnce(instance.server.close);
				assert.isFunction(instance.server.close.firstCall.args[0]);
			});

			it('closes the database connection', () => {
				assert.calledOnce(instance.db.close);
				assert.isFunction(instance.db.close.firstCall.args[0]);
			});

			describe('server close callback', () => {

				beforeEach(() => {
					instance.server.close.firstCall.args[0]();
				});

				it('deletes the `server` property', () => {
					assert.isUndefined(instance.server);
				});

				it('logs that the server has stopped', () => {
					assert.calledWith(instance.log.info, '[teardown:server]: stopped successfully');
				});

			});

			describe('database close callback', () => {

				beforeEach(() => {
					instance.db.close.firstCall.args[0]();
				});

				it('deletes the `db` property', () => {
					assert.isUndefined(instance.db);
				});

				it('logs that the database connection has been closed', () => {
					assert.calledWith(instance.log.info, '[teardown:database]: closed connection successfully');
				});

			});

			describe('when `instance.server` is not set', () => {

				beforeEach(() => {
					http.mockServer.close.resetHistory();
					delete instance.server;
					instance.teardown();
				});

				it('does not attempt to stop the server', () => {
					assert.notCalled(http.mockServer.close);
				});

			});

			describe('when `instance.db` is not set', () => {

				beforeEach(() => {
					mongoose.mockConnection.close.resetHistory();
					delete instance.db;
					instance.teardown();
				});

				it('does not attempt to close the database connection', () => {
					assert.notCalled(mongoose.mockConnection.close);
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

			it('is set to "server/controller"', () => {
				assert.strictEqual(App.defaultOptions.controllerSubPath, 'server/controller');
			});

		});

		describe('.databaseUrl', () => {

			it('is set to `null`', () => {
				assert.isNull(App.defaultOptions.databaseUrl);
			});

		});

		describe('.enforceHttps', () => {

			it('is set to `undefined`', () => {
				assert.isUndefined(App.defaultOptions.enforceHttps);
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

			it('is set to "server/model"', () => {
				assert.strictEqual(App.defaultOptions.modelSubPath, 'server/model');
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

			it('is set to "client/public"', () => {
				assert.strictEqual(App.defaultOptions.publicSubPath, 'client/public');
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

		describe('.sassBundles', () => {

			it('is set to "client/sass"', () => {
				assert.deepEqual(App.defaultOptions.sassBundles, {
					'/main.css': 'main.scss'
				});
			});

		});

		describe('.sassSubPath', () => {

			it('is set to "client/sass"', () => {
				assert.strictEqual(App.defaultOptions.sassSubPath, 'client/sass');
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

			it('is set to "server/view"', () => {
				assert.strictEqual(App.defaultOptions.viewSubPath, 'server/view');
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

	describe('.Schema', () => {

		it('aliases `mongoose.Schema`', () => {
			assert.strictEqual(App.Schema, mongoose.Schema);
		});

	});

	describe('.SchemaType', () => {

		it('aliases `mongoose.SchemaType`', () => {
			assert.strictEqual(App.SchemaType, mongoose.SchemaType);
		});

	});

	describe('.ValidationError', () => {

		it('aliases `mongoose.Error.ValidationError`', () => {
			assert.strictEqual(App.ValidationError, mongoose.Error.ValidationError);
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
				enforceHttps: 'mock-enforce-https',
				env: 'mock-env',
				requestLogFormat: 'mock-request-log-format',
				trustProxy: 'mock-trust-proxy',
				useSecureCookies: 'mock-use-secure-cookies',
				mockDefaultedOptions: true
			};
			expectedOptions = {
				enforceHttps: 'mock-enforce-https',
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

		describe('when `options.enforceHttps` is not defined', () => {

			beforeEach(() => {
				delete defaultedOptions.enforceHttps;
			});

			describe('and `options.env` is "production"', () => {

				beforeEach(() => {
					defaultedOptions.env = 'production';
					returnValue = App.applyDefaultOptions(userOptions);
				});

				it('sets `options.enforceHttps` to `true`', () => {
					assert.isTrue(returnValue.enforceHttps);
				});

			});

			describe('and `options.env` is "development"', () => {

				beforeEach(() => {
					defaultedOptions.env = 'development';
					returnValue = App.applyDefaultOptions(userOptions);
				});

				it('sets `options.enforceHttps` to `false`', () => {
					assert.isFalse(returnValue.enforceHttps);
				});

			});

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
