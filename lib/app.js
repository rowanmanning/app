/**
 * @rowanmanning/app module
 * @module @rowanmanning/app
 */
'use strict';

const Koa = require('koa');
const logger = require('koa-pino-logger');
const mount = require('koa-mount');
const path = require('path');
const Renderer = require('@rowanmanning/renderer');
const Router = require('koa-router');
const serve = require('koa-static');

class App {

	constructor(options) {

		this.options = this.constructor.applyDefaultOptions(options);
		this.name = this.options.name;
		this.env = this.options.env;

		this.paths = {
			base: this.options.basePath,
			public: path.resolve(this.options.basePath, this.options.publicSubPath),
			route: path.resolve(this.options.basePath, this.options.routeSubPath),
			view: path.resolve(this.options.basePath, this.options.viewSubPath)
		};

		this.initKoa();
		this.initLogger();
		this.initRenderer();
		this.initRoutes();
	}

	initKoa() {
		this.app = new Koa();
		this.app.use((context, next) => {
			context.state.app = this;
			context.state.currentUrl = context.url;
			context.state.currentPath = context.path;
			return next();
		});
		this.app.use(this.createErrorHandler());
		this.router = new Router({
			sensitive: true,
			strict: true
		});
	}

	initLogger() {
		const prettyPrint = (
			this.options.env === 'development' &&
			this.options.logDestinationStream === process.stdout
		);
		const loggingMiddleware = logger({
			base: null,
			prettyPrint
		}, this.options.logDestinationStream);
		this.app.use(loggingMiddleware);
		this.log = loggingMiddleware.logger;
	}

	initRenderer() {
		this.renderer = new Renderer({
			path: this.paths.view,
			namespacePaths: Object.assign({}, this.options.viewNamespacePaths, {
				'@app': App.internalPaths.view
			})
		});
		this.app.use(this.renderer.koa());
	}

	initRoutes() {
		this.mountRoutes();
		this.app
			.use(serve(this.paths.public, {
				maxage: (this.env === 'production' ? this.options.publicCacheMaxAge : 0)
			}))
			.use(mount('/@app', serve(App.internalPaths.public, {
				maxage: (this.env === 'production' ? this.options.publicCacheMaxAge : 0)
			})))
			.use(this.router.routes())
			.use(this.router.allowedMethods({
				throw: true
			}));
	}

	mountRoutes() {
		try {
			require(this.paths.route)(this);
		} catch (error) {
			this.router.get('*', context => {
				context.throw(500, 'Routes could not be loaded');
			});
			error.message = `Routes could not be loaded: ${error.message}`;
			this.log.error(error);
		}
	}

	createErrorHandler() {
		return async (context, next) => {
			let error;
			try {
				await next();
			} catch (caughtError) {
				error = caughtError;
			}
			if (!error && context.status === 404 && !context.state.ignoreDefaultErrorHandler) {
				error = new Error('Not Found');
				error.status = 404;
			}
			if (error) {
				context.status = error.statusCode || error.status || 500;
				context.state.error = {
					status: context.status,
					message: error.message,
					stack: (this.options.env === 'production' ? null : error.stack)
				};
				try {
					await context.render(['error', '@app:error'], {
						title: `${this.name} Error: ${context.status}`
					});
				} catch (renderError) {
					this.log.error(renderError);
					context.body = error.message;
				}
			}
		};
	}

	start() {
		return new Promise((resolve, reject) => {
			this.app.listen(this.options.port, error => {
				if (error) {
					this.log.error(`${this.name} failed to start`);
					return reject(error);
				}
				this.log.info(`${this.name} started (PORT=${this.options.port})`);
				resolve(this);
			});
		});
	}

	static applyDefaultOptions(userOptions) {
		return Object.assign({}, App.defaultOptions, this.defaultOptions, userOptions);
	}

}

App.defaultOptions = {
	basePath: process.cwd(),
	env: process.env.NODE_ENV || 'development',
	logDestinationStream: process.stdout,
	name: 'App',
	port: process.env.PORT || 8080,
	publicCacheMaxAge: 1000 * 60 * 60 * 24 * 7,
	publicSubPath: 'public',
	routeSubPath: 'route',
	viewSubPath: 'view',
	viewNamespacePaths: {}
};

App.internalPaths = {
	view: path.join(__dirname, 'view'),
	public: path.join(__dirname, 'public')
};

App.html = Renderer.html;
App.Partial = Renderer.Partial;

module.exports = App;
