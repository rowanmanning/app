
# @rowanmanning/app

Build Express applications with all of my preferences baked in.

## Should I use this?

Not really. Unless you're Rowan Manning.


## Table of Contents

  * [Requirements](#requirements)
  * [Usage](#usage)
    * [Creating an app](#creating-an-app)
    * [Examples](#examples)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 12+


## Usage

Install with [npm](https://www.npmjs.com/):

```sh
npm install @rowanmanning/app
```

Load the library into your code with a `require` call:

```js
const App = require('@rowanmanning/app');
```

### Creating an app

To create an app, create an instance of the `App` class. `options` is an object, [available options are documented here](#app-options).

```js
const app = new App(options);
```

You may also want to [extend the `App` class](#extending) in order to add additional features or default some of the options to something that makes sense for you.

### Starting the app

To start the application, you'll need to use the `setup` method. This does not return anything, if you want to know when the application has started you can use [events](#app-events).

```js
app.setup();
```

### Stopping the app

You can stop the application safely with:

```js
app.teardown();
```

### App options

When you initialise a new application, the following options are available:

  - **`basePath`**: `String`. The path to look for application files in, prepended to all other paths. Defaults to `<CWD>`
  - **`controllerSubPath`**: `String`. The path to look for application controllers in. Will be prepended with `options.basePath`. Defaults to `controller`
  - **`databaseUrl`**: `String`. A MongoDB connection string to use for persistent storage. Defaults to `null`
  - **`enforceHttps`**: `Boolean`. Whether to use redirect HTTP requests to HTTPS. Defaults to `true` when `options.env` is `production`, and `false` when `options.env` is `development`
  - **`env`**: `String`. The environment that the application is running in. Defaults to the `NODE_ENV` environment variable, or `development` if it's not set
  - **`logger`**: `Object`. An object with log methods. Defaults to `console`
  - **`logger.info`**: `Function`. A function used to log information. Defaults to `console.info`
  - **`logger.error`**: `Function`. A function used to log errors. Defaults to `console.error`
  - **`logger.debug`**: `Function`. A function used to log debug messages. Defaults to `console.debug`
  - **`modelSubPath`**: `String`. The path to look for application models in. Will be prepended with `options.basePath`. Defaults to `model`
  - **`name`**: `String`. The name of the application. Used in logs. Defaults to `App`
  - **`port`**: `Number`. The port that the application should run on. Defaults to the `PORT` environment variable or `8080` if it's not set.
  - **`publicCacheMaxAge`**: `Number`. The cache max-age for public resources in production. Defaults to `604800000` (one week)
  - **`publicSubPath`**: `String`. The path to look for application public files in. Will be prepended with `options.basePath`. Defaults to `public`
  - **`requestLogFormat`**: `String`. The request log format, see the [Morgan documentation](https://github.com/expressjs/morgan) for more information. Defaults to `combined` when `options.env` is `production`, and `dev` when `options.env` is `development`
  - **`requestLogOutputStream`**: `Stream`. The stream to pipe request logs into. Defaults to `process.stdout`
  - **`sessionSecret`**: `String`. A secret used to sign session cookies with. If not set, sessions are disabled. Defaults to `null`
  - **`trustProxy`**: Express [trust proxy](http://expressjs.com/en/api.html#trust.proxy.options.table) settings. This is only used if `options.env` is "production". Defaults to `true`
  - **`useSecureCookies`**: `Boolean`. Whether to use secure cookies. Defaults to `true` when `options.env` is `production`, and `false` when `options.env` is `development`
  - **`viewSubPath`**: `String`. The path to look for application views in. Will be prepended with `options.basePath`. Defaults to `view`
  - **`viewNamespacePaths`**: `Object`. Key/value pairs of view namespaces, see the [Renderer documentation](https://github.com/rowanmanning/renderer#namespaces). Defaults to `{}`

### App events

The `App` class extends [`EventEmitter`](https://nodejs.org/api/events.html), and you can listen on the following events:

  - **`database:connected`**: emitted when the MongoDB database connection has been set up.
  - **`server:created`**: emitted when the node HTTP server has been set up. Called with the created HTTP server
  - **`server:started`**: emitted when the HTTP server has started listening on a port. Called with the HTTP server
  - **`setup:error`**: emitted when the `setup` method fails to set up the application. In this scenario it is no longer possible to start the application so it should be [torn down](#stopping-the-app)

### Extending

It's possible to extend the `App` class to add additional features or provide default options:

```js
class MyApp extends App {
    constructor(options = {}) {
        options.name = 'My App';
        super(options);
    }
}
```

The following methods can also be overridden to add or change behaviour. They are called in this order during startup:

  - **`setupDatabase`**: Initialise the MongoDB database. See also the `database:connected` event
  - **`setupModels`**: Load models from the file system and add them to `app.models`
  - **`setupExpress`**: Initialise express and an HTTP server
  - **`setupControllers`**: Load controllers from the file system
  - **`startServer`**: Start the HTTP server


### Examples

A ready-to-use main application file looks something like this:

```js
const App = require('@rowanmanning/app');

const app = new App({
    basePath: __dirname,
    databaseUrl: process.env.DATABASE_URL,
    name: 'My Application',
    sessionSecret: process.env.SESSION_SECRET
});

// Catch setup errors
app.once('setup:error', error => {
    process.exitCode = 1;
    app.log.error(error.stack);
    app.teardown();
});

// Set up the application
app.setup();
```

There are also a few example implementations in the repo which demonstrate some features:

  - **[Basic](example/basic)**: the simplest use of the library to render pages. Run `npm run example-basic` to start the application and visit [localhost:8080](http://localhost:8080/).

  - **[TODO](example/todo)**: a TODO-list application. Run `npm run example-todo` to start the application and visit [localhost:8080](http://localhost:8080/).


## Contributing

To contribute to this library, clone this repo locally and commit your code on a separate branch. Please write unit tests for your code, and run the linter before opening a pull-request:

```sh
make test    # run all tests
make verify  # run all linters
```


## License

Licensed under the [MIT](LICENSE) license.<br/>
Copyright &copy; 2019, Rowan Manning
