
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

  * [Node.js](https://nodejs.org/) 10+


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

```js
const app = new App(options);
```

The available options are:

  - **`basePath`**: `String`. The path to look for application files in, prepended to all other paths. Defaults to `<CWD>`
  - **`controllerSubPath`**: `String`. The path to look for application controllers in. Will be prepended with `options.basePath`. Defaults to `controller`
  - **`databaseUrl`**: `String`. A MongoDB connection string to use for persistent storage. Defaults to `null`
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
  - **`viewSubPath`**: `String`. The path to look for application views in. Will be prepended with `options.basePath`. Defaults to `view`
  - **`viewNamespacePaths`**: `Object`. Key/value pairs of view namespaces, see the [Renderer documentation](https://github.com/rowanmanning/renderer#namespaces). Defaults to `{}`

You can start the application with the `start` method:

```js
app.start();
```

### Examples

We provide a few example implementations which demonstrate different features:

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
