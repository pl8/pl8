'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _hanson = require('hanson');

var _hanson2 = _interopRequireDefault(_hanson);

var _errors = require('../constants/errors.js');

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Config for pl8
 */
var config = {};

/*
 * Configuration file path
 */
/*
 * Libs
 */
var configFile = process.cwd() + '/pl8rc.json';

/*
 * Make sure pl8rc.json config file exists
 */
try {
  config = _fs2.default.readFileSync(configFile, 'utf8');
} catch (err) {
  config = _errors2.default.MISSING;
}

/*
 * Ensure valid relaxed json configuration
 */
var relaxedConfig = _hanson2.default.parse(config);
if (config !== _errors2.default.MISSING) {
  try {
    config = relaxedConfig;
  } catch (err) {
    config = _errors2.default.INVALID;
  }
}

/*
 * Exports
 */
module.exports = {
  config: config
};