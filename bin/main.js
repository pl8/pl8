#!/usr/bin/env node
'use strict';

var _safe = require('colors/safe');

var _safe2 = _interopRequireDefault(_safe);

var _errors = require('./constants/errors.js');

var _errors2 = _interopRequireDefault(_errors);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _config = require('./utils/config.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Check config for errors, if none exist continue w/ prompt
 */
var error = {
  missing: _config.config === _errors2.default.MISSING,
  invalid: _config.config === _errors2.default.INVALID
};

/*
 * Handle errors or show prompts
 */
var err = _safe2.default.red.underline('Error:');

if (error.missing) {
  console.log(err, _safe2.default.white('Missing pl8rc.json config file')); // eslint-disable-line
} else if (error.invalid) {
  console.log(err, _safe2.default.white('There was an issue parsing pl8rc.json. Please validate JSON.')); // eslint-disable-line
} else if (!_config.config.choices && !_config.config.files && !_config.config.configs) {
  console.log(err, _safe2.default.white('Config missing choices and output files.')); // eslint-disable-line
} else {
  // show base config title
  if (_config.config.title) {
    console.log(_safe2.default.white('\n' + _config.config.title + '\n').underline); // eslint-disable-line
  }

  // send to delegate to handle config
  _utils2.default.delegate(_config.config);
}