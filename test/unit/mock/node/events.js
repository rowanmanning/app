'use strict';

const sinon = require('sinon');

class EventEmitter {}
EventEmitter.prototype.emit = sinon.stub();

module.exports = EventEmitter;
