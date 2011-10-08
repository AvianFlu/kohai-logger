/*
 *
 * Multi-transport Hook.io logging hook
 * Supports: File, Console, Redis, Mongo, Loggly
 *
 */

var Hook = require('hook.io').Hook,
    winston = require('winston'),
    MongoDB = require('winston-mongodb').MongoDB,
    util = require('util');


var Logger = exports.Logger = function (options) {

  var self = this;
  Hook.call(this, options);

  self.on('hook::ready', function () {
    var _logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)(),
        new (winston.transports.MongoDB)({
          db: self.db,
          host: self.host,
          port: self.port,
          username: self.username,
          password: self.password
        });
      ]
    });

    self.on('*::gotMessage', function (data) {
      data.time = new Date();
      _logger.info(data);
    });

    self.on('*::sentMessage', function (data) {
      data.time = new Date();
      _logger.silly(data);
    });

    self.on('*::error', function (data) {
      // Under hook.io 0.7.x, this would be a kohai error.  bad.
      data.time = new Date();
      _logger.error(data);
    });

    self.on('*::*::error', function (data) {
      // This would be a child error.  Not quite as bad.
      data.time = new Date();
      _logger.warn(data);
    });

  });
};

//
// Inherit from `hookio.Hook`
//
util.inherits(Logger, Hook);
