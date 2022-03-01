/**
 * @rowanmanning/app module
 * @module @rowanmanning/app
 */
'use strict';

const {camelcase} = require('varname');
const {createServer} = require('http');
const EventEmitter = require('events');
const express = require('express');
const expressPreactViews = require('express-preact-views');
const flash = require('connect-flash');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const notFound = require('@rowanmanning/not-found');
const os = require('os');
const path = require('path');
const {redirectToHTTPS} = require('express-http-to-https');
const renderErrorPage = require('@rowanmanning/render-error-page');
const requireAll = require('@rowanmanning/require-all');
const resaveSass = require('resave-sass');
const session = require('express-session');
const MongoStore = require('connect-mongo');

/**
 * Represents an application.
 */
class App extends EventEmitter {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [options={}]
	 *     An options object used to configure the application.
	 * @param {String} [options.basePath='<CWD>']
	 *     The path to look for application files in, prepended to all other paths.
	 * @param {String} [options.controllerSubPath='server/controller']
	 *     The path to look for application controllers in.
	 *     Will be prepended with `options.basePath`.
	 * @param {String} [options.databaseUrl=null]
	 *     A MongoDB connection string to use for persistent storage.
	 * @param {String} [options.enforceHttps]
	 *     Whether to use redirect HTTP requests to HTTPS. Defaults to `true` when `options.env` is
	 *     "production", and `false` when `options.env` is "development"
	 * @param {String} [options.env='development']
	 *     The environment that the application is running in. One of "production" or "development".
	 *     Defaults to the `NODE_ENV` environment variable.
	 * @param {Object} [options.expressPreactOptions={beautify: true}]
	 *     Express Preact configuration options, see the documentation for more information:
	 *     {@see https://github.com/edwjusti/express-preact-views#options}.
	 * @param {Object} [options.logger=console]
	 *     An object with log methods.
	 * @param {Function} [options.logger.info]
	 *     A function used to log information.
	 * @param {Function} [options.logger.error]
	 *     A function used to log errors.
	 * @param {Function} [options.logger.debug]
	 *     A function used to log debug notices.
	 * @param {String} [options.modelSubPath='server/model']
	 *     The path to look for application models in.
	 *     Will be prepended with `options.basePath`.
	 * @param {String} [options.name='App']
	 *     The name of the application. Used in logs.
	 * @param {(Number|String)} [options.port=8080]
	 *     The port that the application should run on.
	 *     Defaults to the `PORT` environment variable.
	 * @param {Number} [options.publicCacheMaxAge=604800000]
	 *     The cache max-age for public resources in production. Defaults to one week.
	 * @param {String} [options.publicSubPath='client/public']
	 *     The path to look for application public files in.
	 *     Will be prepended with `options.basePath`.
	 * @param {String} [options.requestLogFormat]
	 *     The request log format, see the Morgan documentation for more information:
	 *     {@see https://github.com/expressjs/morgan}.
	 *     Defaults to "combined" when `options.env` is "production",
	 *     and "dev" when `options.env` is "development"
	 * @param {Stream} [options.requestLogOutputStream=process.stdout]
	 *     The stream to pipe request logs into.
	 * @param {Object} [options.securityConfig]
	 *     Security configuration to pass into Helmet {@link https://helmetjs.github.io/}.
	 *     Defaults to undefined.
	 * @param {String} [options.sessionSecret=null]
	 *     A secret used to sign session cookies with. If not set, sessions are disabled.
	 * @param {(Array<String>|Boolean|Function|Number|String)} [options.trustProxy=true]
	 *     Express trust proxy settings, see the Express documentation for more information:
	 *     {@link http://expressjs.com/en/api.html#trust.proxy.options.table}.
	 *     This is only used if `options.env` is "production".
	 * @param {Boolean} [options.useSecureCookies]
	 *     Whether to use secure cookies. Defaults to `true` when `options.env` is "production",
	 *     and `false` when `options.env` is "development"
	 * @param {String} [options.viewSubPath='server/view']
	 *     The path to look for application views in.
	 *     Will be prepended with `options.basePath`.
	 */
	constructor(options) {
		super();

		// Store key options as properties
		this.options = this.constructor.applyDefaultOptions(options);
		this.name = this.options.name;
		this.env = this.options.env;
		this.log = this.options.logger;

		// Resolve the application paths
		this.paths = {
			base: this.options.basePath,
			controller: path.resolve(this.options.basePath, this.options.controllerSubPath),
			model: path.resolve(this.options.basePath, this.options.modelSubPath),
			public: path.resolve(this.options.basePath, this.options.publicSubPath),
			sass: path.resolve(this.options.basePath, this.options.sassSubPath),
			view: path.resolve(this.options.basePath, this.options.viewSubPath)
		};

		// Set up places to store loaded in code
		this.controllers = {};
		this.models = {};
	}

	/**
	 * Set up the application.
	 *
	 * @access public
	 * @returns {App}
	 *     Returns the application instance.
	 */
	setup() {
		this.log.info(`[setup]: initialising in "${this.env}" mode`);
		try {
			this.setupDatabase();
			this.setupExpress();
			this.startServer();
			return this;
		} catch (error) {
			this.emit('setup:error', error);
			return this;
		}
	}

	/**
	 * Initialise the Mongo database. Used in class construction.
	 *
	 * @access private
	 * @returns {undefined}
	 *     Returns nothing.
	 */
	setupDatabase() {
		if (!this.options.databaseUrl) {
			this.log.error('[setup:database]: missing "databaseUrl" option, database not set up');
			return;
		}
		this.db = mongoose.createConnection(this.options.databaseUrl);
		this.db.on('connected', () => {
			this.log.debug(`[setup:database]: connected`);
			this.emit('database:connected');
		});
		this.setupModels();
	}

	/**
	 * Initialise the application models. Used in class construction.
	 *
	 * @access private
	 * @returns {undefined}
	 *     Returns nothing.
	 */
	setupModels() {
		try {
			for (const {name, moduleExports: setupModel} of requireAll(this.paths.model)) {
				const camelcaseName = camelcase(name);
				this.models[camelcaseName] = this.db.model(camelcaseName, setupModel(this));
				this.log.debug(`[setup:models]: "${camelcaseName}" model initialised`);
			}
		} catch (error) {
			error.message = `Models could not be loaded: ${error.message}`;
			throw error;
		}
	}

	/**
	 * Initialise the Express application. Used in class construction.
	 *
	 * @access private
	 * @returns {undefined}
	 *     Returns nothing.
	 */
	setupExpress() {
		const app = this.express = this.router = express();
		const server = this.server = createServer(app);
		this.emit('server:created', server);

		// Configure Express
		app.enable('case sensitive routing');
		app.enable('strict routing');
		app.set('json spaces', 4);

		// Configure proxy trust in production
		if (this.env === 'production') {
			app.set('trust proxy', this.options.trustProxy);
		}

		// Render views with Preact
		app.set('views', this.paths.view);
		app.set('view engine', 'jsx');
		app.engine('jsx', expressPreactViews.createEngine(this.options.expressPreactOptions));

		// Provide some basic security settings with Helmet
		// and automatic HTTPS redirects
		app.use(helmet(this.options.securityConfig));
		if (this.options.enforceHttps) {
			app.use(redirectToHTTPS());
		}

		// Parse the request body
		app.use(express.urlencoded({
			extended: false
		}));
		app.use(express.json({
			strict: false
		}));

		// Set up sessions
		if (this.options.sessionSecret) {
			this.sessionMiddleware = session({
				cookie: {
					sameSite: 'lax',
					secure: this.options.useSecureCookies
				},
				name: `${this.name} Session`,
				resave: false,
				saveUninitialized: false,
				secret: this.options.sessionSecret,
				store: (
					this.options.databaseUrl ?
						MongoStore.create({client: this.db.getClient()}) :
						new session.Store()
				)
			});
			app.use(this.sessionMiddleware);
			this.log.info('[setup:sessions]: sessions set up successfully');

			// Set up flash messages
			this.flashMessageMiddleware = flash();
			app.use(this.flashMessageMiddleware);
		} else {
			this.log.error('[setup:sessions]: missing "sessionSecret" option, sessions not set up');
		}

		// Add some properties to the response locals
		app.locals.app = this;
		app.use((request, response, next) => {
			response.locals.request = request;
			response.locals.currentUrl = request.url;
			response.locals.currentPath = request.path;
			next();
		});

		// Add request logging
		if (this.options.requestLogFormat) {
			app.use(morgan(this.options.requestLogFormat, {
				stream: this.options.requestLogOutputStream,
				skip: request => request.path === '/favicon.ico'
			}));
		}

		// Load the controllers
		this.setupControllers();

		// Set up static routes
		const maxAge = (this.env === 'production' ? this.options.publicCacheMaxAge : 0);
		app.use(express.static(this.paths.public, {maxAge}));

		// Set up client-side asset compilation
		this.setupClientAssetCompilation();

		// Set up error handling
		app.use(notFound());
		app.use(renderErrorPage({
			errorLogger: error => {
				const stack = error.stack.split(/\n\s+/).slice(1).join('\n');
				this.log.error(
					`${error.name || 'Error'}: ${error.message} ${JSON.stringify({stack})}`
				);
			},
			errorLoggingFilter: error => {
				const status = error.statusCode || error.status;
				return !status || status >= 500;
			},
			includeErrorStack: (this.env !== 'production')
		}));
	}

	/**
	 * Initialise the application controllers. Used in class construction.
	 *
	 * @access private
	 * @returns {undefined}
	 *     Returns nothing.
	 */
	setupControllers() {
		try {
			const controllers = requireAll(this.paths.controller);
			for (const {name, moduleExports: setupController} of controllers) {
				const camelcaseName = camelcase(name);
				this.controllers[camelcaseName] = setupController(this);
				this.log.debug(`[setup:controllers]: "${camelcaseName}" controller initialised`);
			}
		} catch (error) {
			error.message = `Controllers could not be loaded: ${error.message}`;
			throw error;
		}
	}

	/**
	 * Initialise the application client-side asset compiltion. Used in class construction.
	 *
	 * @access private
	 * @returns {undefined}
	 *     Returns nothing.
	 */
	setupClientAssetCompilation() {

		// Set up Sass compilation
		this.router.use(resaveSass({
			basePath: this.paths.sass,
			bundles: this.options.sassBundles,
			log: {
				error: this.log.error.bind(this.log, '[assets:sass]:'),
				info: this.log.info.bind(this.log, '[assets:sass]:')
			},
			savePath: (this.env === 'production' ? this.paths.public : null)
		}));

	}

	/**
	 * Start the application server. Used in class construction.
	 *
	 * @access private
	 * @returns {undefined}
	 *     Returns nothing.
	 */
	startServer() {
		this.server.listen(this.options.port, error => {
			if (error) {
				this.log.error(`[setup:server]: failed to start`);
				return this.emit('setup:error', error);
			}
			const address = `http://${os.hostname()}:${this.server.address().port}`;
			this.log.info(`[setup:server]: started successfully ${address}`);
			this.emit('server:started', this.server);
		});
	}

	/**
	 * Tear down the application.
	 *
	 * @access public
	 * @returns {undefined}
	 *     Returns nothing.
	 */
	teardown() {
		if (this.server) {
			this.server.close(() => {
				this.log.info('[teardown:server]: stopped successfully');
				delete this.server;
			});
		}
		if (this.db) {
			this.db.close(() => {
				this.log.info('[teardown:database]: closed connection successfully');
				delete this.db;
			});
		}
	}

	/**
	 * Apply default values to a set of user-provided options.
	 * Used internally by {@link App#constructor}.
	 *
	 * @access private
	 * @param {Object} [userOptions={}]
	 *     Options to add on top of the defaults. See {@link App#constructor}.
	 * @returns {Object}
	 *     Returns the defaulted options.
	 */
	static applyDefaultOptions(userOptions) {
		const options = Object.assign({}, App.defaultOptions, this.defaultOptions, userOptions);
		if (options.enforceHttps === undefined) {
			options.enforceHttps = (options.env === 'production');
		}
		if (options.requestLogFormat === undefined) {
			options.requestLogFormat = (options.env === 'production' ? 'combined' : 'dev');
		}
		if (options.useSecureCookies === undefined) {
			options.useSecureCookies = (options.env === 'production');
		}
		return options;
	}

}

/**
 * Default options to be used in construction of an application.
 *
 * @access private
 * @type {Object}
 */
App.defaultOptions = {
	basePath: process.cwd(),
	controllerSubPath: 'server/controller',
	expressPreactOptions: {
		beautify: true
	},
	databaseUrl: null,
	enforceHttps: undefined,
	env: process.env.NODE_ENV || 'development',
	logger: console,
	modelSubPath: 'server/model',
	name: 'App',
	port: process.env.PORT || 8080,
	publicCacheMaxAge: 1000 * 60 * 60 * 24 * 7,
	publicSubPath: 'client/public',
	requestLogFormat: undefined,
	requestLogOutputStream: process.stdout,
	sassBundles: {
		'/main.css': 'main.scss'
	},
	sassSubPath: 'client/sass',
	sessionSecret: null,
	trustProxy: true,
	useSecureCookies: undefined,
	viewNamespacePaths: {},
	viewSubPath: 'server/view'
};

// Alias some dependencies so that they
// can be safely used by applications
App.Schema = mongoose.Schema;
App.SchemaType = mongoose.SchemaType;
App.ValidationError = mongoose.Error.ValidationError;

module.exports = App;
