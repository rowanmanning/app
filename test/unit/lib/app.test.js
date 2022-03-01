'use strict';

const {assert} = require('chai');
const td = require('testdouble');

describe('lib/app', () => {
	let App;
	let connectFlash;
	let connectMongo;
	let EventEmitter;
	let express;
	let expressHttpToHttps;
	let expressPreactViews;
	let helmet;
	let http;
	let mongoose;
	let morgan;
	let notFound;
	let os;
	let renderErrorPage;
	let requireAll;
	let resaveSass;
	let session;

	beforeEach(() => {
		process.env.NODE_ENV = 'test';
		process.env.PORT = 'mock-port';

		connectFlash = td.replace('connect-flash', require('../mock/npm/connect-flash'));
		td.when(connectFlash()).thenReturn(connectFlash.mockMiddleware);
		connectMongo = td.replace('connect-mongo', require('../mock/npm/connect-mongo'));
		EventEmitter = td.replace('events', require('../mock/node/events'));
		express = td.replace('express', require('../mock/npm/express'));
		expressHttpToHttps = td.replace('express-http-to-https', require('../mock/npm/express-http-to-https'));
		expressPreactViews = td.replace('express-preact-views', require('../mock/npm/express-preact-views'));
		helmet = td.replace('helmet', require('../mock/npm/helmet'));
		http = td.replace('http', require('../mock/node/http'));
		mongoose = td.replace('mongoose', require('../mock/npm/mongoose'));
		morgan = td.replace('morgan', require('../mock/npm/morgan'));
		notFound = td.replace('@rowanmanning/not-found', require('../mock/npm/@rowanmanning/not-found'));
		os = td.replace('os', require('../mock/node/os'));
		renderErrorPage = td.replace('@rowanmanning/render-error-page', require('../mock/npm/@rowanmanning/render-error-page'));
		requireAll = td.replace('@rowanmanning/require-all', require('../mock/npm/@rowanmanning/require-all'));
		resaveSass = td.replace('resave-sass', require('../mock/npm/resave-sass'));
		session = td.replace('express-session', require('../mock/npm/express-session'));
		td.replace('varname', require('../mock/npm/varname'));

		App = require('../../../lib/app');
	});

	it('creates a MongoStore using the session middleware', () => {
		td.verify(connectMongo(session), {times: 1});
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
				expressPreactOptions: 'mock-express-preact-options',
				logger: {
					info: td.func(),
					error: td.func(),
					debug: td.func()
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
				securityConfig: 'mock-security-config',
				sessionSecret: 'mock-session-secret',
				trustProxy: 'mock-trust-proxy',
				useSecureCookies: 'mock-use-secure-cookies',
				viewNamespacePaths: 'mock-view-namespace-paths',
				viewSubPath: 'mock-view-path'
			};
			userOptions = {mockUserOptions: true};
			td.replace(App, 'applyDefaultOptions');
			td.when(App.applyDefaultOptions(userOptions)).thenReturn(defaultedOptions);
			instance = new App(userOptions);
		});

		it('extends EventEmitter', () => {
			assert.instanceOf(instance, EventEmitter);
		});

		it('calls `App.applyDefaultOptions` with `options`', () => {
			td.verify(App.applyDefaultOptions(userOptions), {times: 1});
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
				td.replace(App.prototype, 'setupDatabase');
				td.replace(App.prototype, 'setupExpress');
				td.replace(App.prototype, 'startServer');
				returnValue = instance.setup();
			});

			it('calls `instance.setupDatabase`', () => {
				td.verify(instance.setupDatabase(), {times: 1});
			});

			it('calls `instance.setupExpress`', () => {
				td.verify(instance.setupExpress(), {times: 1});
			});

			it('calls `instance.startServer`', () => {
				td.verify(instance.startServer(), {times: 1});
			});

			it('returns the instance', () => {
				assert.strictEqual(returnValue, instance);
			});

			describe('when one of the called methods throws an error', () => {
				let caughtError;
				let mockError;

				beforeEach(() => {
					mockError = new Error('mock error');
					td.when(App.prototype.startServer()).thenThrow(mockError);
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
					td.verify(instance.emit('setup:error', mockError), {times: 1});
				});

				it('returns the instance', () => {
					assert.strictEqual(returnValue, instance);
				});

			});

		});

		describe('.setupDatabase()', () => {

			beforeEach(() => {
				td.replace(App.prototype, 'setupModels');
				instance.setupDatabase();
			});

			it('creates a Mongoose connection using `options.databaseUrl`', () => {
				td.verify(mongoose.createConnection('mock-database-url', {
					useCreateIndex: true,
					useFindAndModify: false,
					useNewUrlParser: true,
					useUnifiedTopology: true
				}), {times: 1});
			});

			it('sets `instance.db` to the created Mongoose connection', () => {
				assert.strictEqual(instance.db, mongoose.mockConnection);
			});

			it('listens for the connection `connected` event', () => {
				td.verify(instance.db.on('connected', td.matchers.isA(Function)), {times: 1});
			});

			describe('instance.db `connected` handler', () => {

				beforeEach(() => {
					instance.emit = td.func();
					td.explain(instance.db.on).calls[0].args[1]();
				});

				it('logs that the database has connected', () => {
					td.verify(instance.log.debug('[setup:database]: connected'));
				});

				it('emits a `database:connected` event', () => {
					td.verify(instance.emit('database:connected'), {times: 1});
				});

			});

			it('calls `instance.setupModels`', () => {
				td.verify(instance.setupModels(), {times: 1});
			});

			describe('when `options.databaseUrl` is not set', () => {

				beforeEach(() => {
					instance.options.databaseUrl = undefined;
					mongoose.createConnection = td.func();
					instance.setupModels = td.func();
					instance.setupDatabase();
				});

				it('does not create a Mognoose connection', () => {
					td.verify(mongoose.createConnection(), {
						ignoreExtraArgs: true,
						times: 0
					});
				});

				it('does not call `instance.setupModels`', () => {
					td.verify(instance.setupModels(), {
						ignoreExtraArgs: true,
						times: 0
					});
				});

				it('logs an error to explain that the database has not been set up', () => {
					td.verify(instance.log.error('[setup:database]: missing "databaseUrl" option, database not set up'));
				});

			});

		});

		describe('.setupModels()', () => {
			let mockSchema1;
			let mockSchema2;

			beforeEach(() => {
				instance.models = {};
				instance.db = mongoose.mockConnection;
				instance.paths.model = 'mock-instance-model-path';
				mockSchema1 = {
					name: 'first/mock/name',
					moduleExports: td.func()
				};
				td.when(mockSchema1.moduleExports(), {ignoreExtraArgs: true}).thenReturn('FirstMockSchema');
				mockSchema2 = {
					name: 'second/mock/name',
					moduleExports: td.func()
				};
				td.when(mockSchema2.moduleExports(), {ignoreExtraArgs: true}).thenReturn('SecondMockSchema');
				td.when(requireAll(), {ignoreExtraArgs: true}).thenReturn([
					mockSchema1,
					mockSchema2
				]);
				td.when(mongoose.mockConnection.model('FirstMockName', 'FirstMockSchema')).thenReturn('FirstMockModel');
				td.when(mongoose.mockConnection.model('SecondMockName', 'SecondMockSchema')).thenReturn('SecondMockModel');
				instance.setupModels();
			});

			it('requires all of the models and initialises them', () => {
				td.verify(requireAll('mock-instance-model-path'), {times: 1});
				td.verify(mockSchema1.moduleExports(instance), {times: 1});
				td.verify(mockSchema2.moduleExports(instance), {times: 1});
			});

			it('registers each of the model schemas with Mongoose, camel-casing the names', () => {
				td.verify(mongoose.mockConnection.model('FirstMockName', 'FirstMockSchema'), {times: 1});
				td.verify(mongoose.mockConnection.model('SecondMockName', 'SecondMockSchema'), {times: 1});
			});

			it('logs that each model has been initialised', () => {
				td.verify(instance.log.debug('[setup:models]: "FirstMockName" model initialised'), {times: 1});
				td.verify(instance.log.debug('[setup:models]: "SecondMockName" model initialised'), {times: 1});
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
					td.when(requireAll(), {ignoreExtraArgs: true}).thenThrow(mockError);
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

		describe('.setupExpress()', () => {

			beforeEach(() => {
				instance.db = mongoose.mockConnection;
				instance.setupControllers = td.func();
				instance.setupClientAssetCompilation = td.func();
				instance.setupExpress();
			});

			it('creates an Express application', () => {
				td.verify(express(), {times: 1});
			});

			it('sets `instance.express` to the created Express application', () => {
				assert.strictEqual(instance.express, express.mockApp);
			});

			it('sets `instance.router` to the created Express application', () => {
				assert.strictEqual(instance.router, express.mockApp);
			});

			it('creates an HTTP server with the created Express application', () => {
				td.verify(http.createServer(instance.express), {times: 1});
			});

			it('sets `instance.server` to the created HTTP server', () => {
				assert.strictEqual(instance.server, http.mockServer);
			});

			it('emits a `server:created` event, passing the server to that', () => {
				td.verify(instance.emit('server:created', instance.server), {times: 1});
			});

			it('enables case-sensitive routing', () => {
				td.verify(express.mockApp.enable('case sensitive routing'), {times: 1});
			});

			it('enables strict routing', () => {
				td.verify(express.mockApp.enable('strict routing'), {times: 1});
			});

			it('sets JSON whitespace to four spaces', () => {
				td.verify(express.mockApp.set('json spaces', 4), {times: 1});
			});

			it('does not set the trust proxy option', () => {
				td.verify(express(express.mockApp.set('trust proxy')), {times: 0});
			});

			it('sets up Express Preact views', () => {
				td.verify(express.mockApp.set('views', '/mock-base-path/mock-view-path'), {times: 1});
				td.verify(express.mockApp.set('view engine', 'jsx'), {times: 1});
				td.verify(expressPreactViews.createEngine('mock-express-preact-options'), {times: 1});
				td.verify(express.mockApp.engine('jsx', expressPreactViews.mockViewEngine), {times: 1});
			});

			it('creates and mounts Helmet middleware', () => {
				td.verify(helmet('mock-security-config'), {times: 1});
				td.verify(express.mockApp.use(helmet.mockMiddleware), {times: 1});
			});

			it('creates and mounts redirectToHTTPS middleware', () => {
				td.verify(expressHttpToHttps.redirectToHTTPS(), {times: 1});
				td.verify(express.mockApp.use(expressHttpToHttps.mockMiddleware), {times: 1});
			});

			it('creates and mounts URL-encoded body parser middleware', () => {
				td.verify(express.urlencoded({extended: false}), {times: 1});
				td.verify(express.mockApp.use(express.urlencoded.mockMiddleware), {times: 1});
			});

			it('creates and mounts JSON body parser middleware', () => {
				td.verify(express.json({strict: false}), {times: 1});
				td.verify(express.mockApp.use(express.json.mockMiddleware), {times: 1});
			});

			it('creates a Mongo session store', () => {
				td.verify(new connectMongo.MongoStore({
					mongooseConnection: mongoose.mockConnection
				}), {times: 1});
			});

			it('creates and mounts session middleware', () => {
				td.verify(session({
					name: 'mock-name Session',
					resave: false,
					saveUninitialized: false,
					secret: 'mock-session-secret',
					store: connectMongo.mockMongoStore,
					cookie: {
						sameSite: 'lax',
						secure: 'mock-use-secure-cookies'
					}
				}), {times: 1});
				td.verify(express.mockApp.use(session.mockMiddleware), {times: 1});
			});

			it('sets `instance.sessionMiddleware` to the created session middleware', () => {
				assert.strictEqual(instance.sessionMiddleware, session.mockMiddleware);
			});

			it('logs that sessions have been set up', () => {
				td.verify(instance.log.info('[setup:sessions]: sessions set up successfully'));
			});

			it('creates and mounts flash message middleware', () => {
				td.verify(connectFlash(), {times: 1});
				td.verify(express.mockApp.use(connectFlash.mockMiddleware), {times: 1});
			});

			it('sets `instance.flashMessageMiddleware` to the created flash message middleware', () => {

				assert.strictEqual(instance.flashMessageMiddleware, connectFlash.mockMiddleware);
			});

			it('sets the `app` application local to the application instance', () => {
				assert.strictEqual(express.mockApp.locals.app, instance);
			});

			it('mounts some middleware to add response locals for the current URL and path', () => {
				const setResponseLocals = td.explain(express.mockApp.use).calls.find(call => {
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
					setResponseLocals = td.explain(express.mockApp.use).calls.find(call => {
						return (typeof call.args[0] === 'function' && !call.args[0].name);
					}).args[0];
					request = {
						url: 'mock-url',
						path: 'mock-path'
					};
					response = {
						locals: {}
					};
					next = td.func();
					setResponseLocals(request, response, next);
				});

				it('sets `response.locals.request` to `request`', () => {
					assert.strictEqual(response.locals.request, request);
				});

				it('sets `response.locals.currentUrl` to `request.url`', () => {
					assert.strictEqual(response.locals.currentUrl, 'mock-url');
				});

				it('sets `response.locals.currentPath` to `request.path`', () => {
					assert.strictEqual(response.locals.currentPath, 'mock-path');
				});

				it('calls `next` with no arguments', () => {
					td.verify(next(), {times: 1});
				});

			});

			it('creates and mounts morgan middleware', () => {
				td.verify(morgan('mock-request-log-format', {
					stream: 'mock-request-log-output-stream',
					skip: td.matchers.isA(Function)
				}), {times: 1});
				td.verify(express.mockApp.use(morgan.mockMiddleware), {times: 1});
			});

			describe('morgan `skip` option: skip(request)', () => {
				let returnValue;
				let skip;

				beforeEach(() => {
					skip = td.explain(morgan).calls[0].args[1].skip;
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
				td.verify(instance.setupControllers(), {times: 1});
			});

			it('creates and mounts static middleware', () => {
				td.verify(express.static(instance.paths.public, {maxAge: 0}), {times: 1});
				td.verify(express.mockApp.use(express.static.mockMiddleware), {times: 1});
			});

			it('initialises client-side asset compilation', () => {
				td.verify(instance.setupClientAssetCompilation(), {times: 1});
			});

			it('creates and mounts notFound middleware', () => {
				td.verify(notFound(), {times: 1});
				td.verify(express.mockApp.use(notFound.mockMiddleware), {times: 1});
			});

			it('creates and mounts renderErrorPage middleware', () => {
				td.verify(renderErrorPage({
					errorLogger: td.matchers.isA(Function),
					errorLoggingFilter: td.matchers.isA(Function),
					includeErrorStack: true
				}), {times: 1});
				td.verify(express.mockApp.use(renderErrorPage.mockMiddleware), {times: 1});
			});

			describe('renderErrorPage `errorLogger` option: errorLogger(error)', () => {
				let errorLogger;

				beforeEach(() => {
					errorLogger = td.explain(renderErrorPage).calls[0].args[0].errorLogger;
					const error = new Error('mock error');
					error.name = 'MockErrorName';
					error.stack = 'mock error\n  mock stack line 1\n  mock stack line 2';
					instance.log.error = td.func();
					errorLogger(error);
				});

				it('logs a string version of the error', () => {
					td.verify(instance.log.error('MockErrorName: mock error {"stack":"mock stack line 1\\nmock stack line 2"}'));
				});

				describe('when `error.name` is falsy', () => {

					beforeEach(() => {
						const error = {
							message: 'mock error',
							stack: 'mock error\n  mock stack line 1\n  mock stack line 2'
						};
						instance.log.error = td.func();
						errorLogger(error);
					});

					it('logs a string version of the error', () => {
						td.verify(instance.log.error('Error: mock error {"stack":"mock stack line 1\\nmock stack line 2"}'));
					});

				});

			});

			describe('renderErrorPage `errorLoggingFilter` option: errorLoggingFilter(error)', () => {
				let errorLoggingFilter;
				let returnValue;

				beforeEach(() => {
					errorLoggingFilter = td.explain(renderErrorPage).calls[0].args[0].errorLoggingFilter;
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

			describe('when `options.env` is "production"', () => {

				beforeEach(() => {
					instance.env = 'production';
					express.static = td.func();
					instance.setupExpress();
				});

				it('sets the trust proxy option', () => {
					td.verify(express.mockApp.set('trust proxy', 'mock-trust-proxy'), {times: 1});
				});

				it('creates static middleware with the configured `publicCacheMaxAge` option', () => {
					td.verify(express.static(), {
						ignoreExtraArgs: true,
						times: 1
					});
					assert.strictEqual(td.explain(express.static).calls[0].args[1].maxAge, 'mock-cache-max-age');
				});

				it('creates renderErrorPage middleware without including the error stack', () => {
					td.verify(renderErrorPage(), {
						ignoreExtraArgs: true,
						times: 2
					});
					assert.isFalse(td.explain(renderErrorPage).calls[1].args[0].includeErrorStack);
				});

			});

			describe('when `options.databaseUrl` is not set', () => {

				beforeEach(() => {
					delete instance.options.databaseUrl;
					connectMongo.MongoStore = td.func();
					instance.setupExpress();
				});

				it('does not create a Mongo session store', () => {
					td.verify(new connectMongo.MongoStore(), {
						ignoreExtraArgs: true,
						times: 0
					});
				});

				it('creates an in-memory session store', () => {
					td.verify(new session.Store(), {times: 1});
				});

				it('creates session middleware with the in-memory store', () => {
					td.verify(session(), {
						ignoreExtraArgs: true,
						times: 2
					});
					assert.strictEqual(td.explain(session).calls[1].args[0].store, session.mockStore);
				});

			});

			describe('when `options.enforceHttps` is `false`', () => {

				beforeEach(() => {
					instance.options.enforceHttps = false;
					expressHttpToHttps.redirectToHTTPS = td.func();
					express.mockApp.use = td.func();
					instance.setupExpress();
				});

				it('does not create and mount redirectToHTTPS middleware', () => {
					td.verify(expressHttpToHttps.redirectToHTTPS(), {
						ignoreExtraArgs: true,
						times: 0
					});
					td.verify(express.mockApp.use(expressHttpToHttps.mockMiddleware), {
						times: 0
					});
				});

			});

			describe('when `options.sessionSecret` is not set', () => {

				beforeEach(() => {
					delete instance.options.sessionSecret;
					connectMongo.MongoStore = td.func();
					session.Store = td.func();
					express.mockApp.use = td.func();
					instance.setupExpress();
				});

				it('does not create a Mongo session store', () => {
					td.verify(new connectMongo.MongoStore(), {
						ignoreExtraArgs: true,
						times: 0
					});
				});

				it('does not create an in-memory session store', () => {
					td.verify(new session.Store(), {
						ignoreExtraArgs: true,
						times: 0
					});
				});

				it('does not mount session middleware', () => {
					td.verify(express.mockApp.use(session.mockMiddleware), {times: 0});
				});

				it('does not mount flash message middleware', () => {
					td.verify(express.mockApp.use(connectFlash.mockMiddleware), {times: 0});
				});

				it('logs an error to explain that sessions are not configured', () => {
					td.verify(instance.log.error('[setup:sessions]: missing "sessionSecret" option, sessions not set up'));
				});

			});

			describe('when `options.requestLogFormat` is not set', () => {

				beforeEach(() => {
					delete instance.options.requestLogFormat;
					express.mockApp.use = td.func();
					instance.setupExpress();
				});

				it('does not mount morgan middleware', () => {
					td.verify(express.mockApp.use(morgan.mockMiddleware), {times: 0});
				});

			});

		});

		describe('.setupControllers()', () => {
			let mockController1;
			let mockController2;

			beforeEach(() => {
				instance.controllers = {};
				instance.db = mongoose.mockConnection;
				instance.paths.controller = 'mock-instance-controller-path';
				mockController1 = {
					name: 'first/mock/name',
					moduleExports: td.func()
				};
				td.when(mockController1.moduleExports(), {ignoreExtraArgs: true}).thenReturn('FirstMockController');
				mockController2 = {
					name: 'second/mock/name',
					moduleExports: td.func()
				};
				td.when(mockController2.moduleExports(), {ignoreExtraArgs: true}).thenReturn('SecondMockController');
				td.when(requireAll(), {ignoreExtraArgs: true}).thenReturn([
					mockController1,
					mockController2
				]);
				instance.setupControllers();
			});

			it('requires all of the controllers, camel-casing the names and initialising them', () => {
				td.verify(requireAll('mock-instance-controller-path'), {times: 1});
				td.verify(mockController1.moduleExports(instance), {times: 1});
				td.verify(mockController2.moduleExports(instance), {times: 1});
			});

			it('logs that each controller has been initialised', () => {
				td.verify(instance.log.debug('[setup:controllers]: "FirstMockName" controller initialised'));
				td.verify(instance.log.debug('[setup:controllers]: "SecondMockName" controller initialised'));
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
					td.when(requireAll(), {ignoreExtraArgs: true}).thenThrow(mockError);
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
				express.mockApp.use = td.func();
				instance.router = express.mockApp;
				instance.setupClientAssetCompilation();
			});

			it('creates and mounts Resave Sass middleware, opting not to save compiled files', () => {
				td.verify(resaveSass({
					basePath: '/mock-base-path/mock-sass-path',
					bundles: 'mock-sass-bundles',
					log: {
						error: td.matchers.isA(Function),
						info: td.matchers.isA(Function)
					},
					savePath: null
				}), {times: 1});
				td.verify(express.mockApp.use(resaveSass.mockMiddleware), {times: 1});
			});

			it('uses bound logging functions in the Resave Sass configuration', () => {
				const log = td.explain(resaveSass).calls[0].args[0].log;
				log.error('mock error');
				td.verify(instance.log.error('[assets:sass]:', 'mock error'), {times: 1});
				log.info('mock info');
				td.verify(instance.log.info('[assets:sass]:', 'mock info'), {times: 1});
			});

			describe('when `options.env` is "production"', () => {

				beforeEach(() => {
					instance.env = 'production';
					instance.setupClientAssetCompilation();
				});

				it('creates and mounts Resave Sass middleware, saving compiled files', () => {
					td.verify(resaveSass(), {
						ignoreExtraArgs: true,
						times: 2
					});
					assert.strictEqual(
						td.explain(resaveSass).calls[1].args[0].savePath,
						'/mock-base-path/mock-public-path'
					);
				});

			});

		});

		describe('.startServer()', () => {

			beforeEach(() => {
				instance.server = http.mockServer;
				td.when(instance.server.listen('mock-port')).thenCallback();
				td.when(os.hostname()).thenReturn('mock-os-hostname');
				http.mockAddress.port = 'mock-server-address-port';
				instance.startServer();
			});

			it('starts the HTTP server listening on the given `port` option', () => {
				td.verify(instance.server.listen('mock-port', td.matchers.isA(Function)), {
					times: 1
				});
			});

			it('logs that the server has started', () => {
				td.verify(instance.log.info('[setup:server]: started successfully http://mock-os-hostname:mock-server-address-port'));
			});

			it('emits a `server:started` event, passing the server to that', () => {
				td.verify(instance.emit('server:started', instance.server), {times: 1});
			});

			describe('when listening on the port fails', () => {
				let caughtError;
				let mockError;

				beforeEach(() => {
					instance.emit = td.func();
					instance.log.info = td.func();
					mockError = new Error('mock error');
					td.when(instance.server.listen('mock-port')).thenCallback(mockError);
					try {
						instance.startServer();
					} catch (error) {
						caughtError = error;
					}
				});

				it('logs that the application has failed to start', () => {
					td.verify(instance.log.error('[setup:server]: failed to start'));
				});

				it('does not log that the application has started', () => {
					td.verify(instance.log.info(), {
						ignoreExtraArgs: true,
						times: 0
					});
				});

				it('does not emit a `server:started` event', () => {
					td.verify(instance.emit('server:started', instance.server), {times: 0});
				});

				it('does not throw the error', () => {
					assert.isUndefined(caughtError);
				});

				it('emits a `setup:error` event, passing the error to that', () => {
					td.verify(instance.emit('setup:error', mockError), {times: 1});
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
				td.verify(instance.server.close(td.matchers.isA(Function)), {times: 1});
			});

			it('closes the database connection', () => {
				td.verify(instance.db.close(td.matchers.isA(Function)), {times: 1});
			});

			describe('server close callback', () => {

				beforeEach(() => {
					td.explain(instance.server.close).calls[0].args[0]();
				});

				it('deletes the `server` property', () => {
					assert.isUndefined(instance.server);
				});

				it('logs that the server has stopped', () => {
					td.verify(instance.log.info('[teardown:server]: stopped successfully'));
				});

			});

			describe('database close callback', () => {

				beforeEach(() => {
					td.explain(instance.db.close).calls[0].args[0]();
				});

				it('deletes the `db` property', () => {
					assert.isUndefined(instance.db);
				});

				it('logs that the database connection has been closed', () => {
					td.verify(instance.log.info('[teardown:database]: closed connection successfully'));
				});

			});

			describe('when `instance.server` is not set', () => {

				beforeEach(() => {
					http.mockServer.close = td.func();
					delete instance.server;
					instance.teardown();
				});

				it('does not attempt to stop the server', () => {
					td.verify(http.mockServer.close(), {
						ignoreExtraArgs: true,
						times: 0
					});
				});

			});

			describe('when `instance.db` is not set', () => {

				beforeEach(() => {
					mongoose.mockConnection.close = td.func();
					delete instance.db;
					instance.teardown();
				});

				it('does not attempt to close the database connection', () => {
					td.verify(mongoose.mockConnection.close(), {
						ignoreExtraArgs: true,
						times: 0
					});
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
					// Global.refreshAllMocking();
					delete process.env.NODE_ENV;
					App = require('../../../lib/app');
				});

				it('is set to "development"', () => {
					assert.strictEqual(App.defaultOptions.env, 'development');
				});

			});

		});

		describe('.expressPreactOptions', () => {

			it('is set to beautify output by default', () => {
				assert.deepEqual(App.defaultOptions.expressPreactOptions, {
					beautify: true
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
					// Global.refreshAllMocking();
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
			td.replace(Object, 'assign');
			td.when(Object.assign(), {ignoreExtraArgs: true}).thenReturn(defaultedOptions);
			returnValue = App.applyDefaultOptions(userOptions);
		});

		it('defaults the `options`', () => {
			td.verify(Object.assign(
				{},
				App.defaultOptions,
				App.defaultOptions,
				userOptions
			), {times: 1});
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
