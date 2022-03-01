'use strict';

const td = require('testdouble');

class EventEmitter {}
EventEmitter.prototype.emit = td.func('EventEmitter.prototype.emit');

module.exports = EventEmitter;
