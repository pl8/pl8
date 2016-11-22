'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // libs
// eslint-disable-line


var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _hanson = require('hanson');

var _hanson2 = _interopRequireDefault(_hanson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Delete config param then send back to delegate
 * dtd: delete then delegate
 */
var dtd = function dtd(param, config) {
  if (param) {
    delete config[param]; // eslint-disable-line
  }

  delegate(config); // eslint-disable-line
};

/*
 * Paths
 * - dir: base path of .pl8rc file
 * - basePath: base path for project files
 */
var dir = process.cwd(); // current working directory
var basePath = dir; // base path for all output files


/*
 * Vars config handler
 * - set variables in store
 * - delete vars from config
 * - send to delegate to further handle config data
 */
var vars = function vars(config) {
  _index2.default.vars.set(config.vars, function () {
    return dtd('vars', config);
  });
};

/*
 * Inputs config handler
 * - handle inputs one at a time
 * - wait for a response before progressing to the next user input
 * - once finished, send to delegate to further handle config data
 */
var inputs = function inputs(config) {
  // start at the first index
  var currentIndex = 0;
  var input = config.inputs[currentIndex];

  // handle prompt response
  var response = function response(answer) {
    // save input value as pl8 variable
    _index2.default.vars.setRef(input.ref, answer.input);

    // update index to process next input (if it exists)
    currentIndex += 1;
    if (currentIndex !== config.inputs.length) {
      // update current input config
      input = config.inputs[currentIndex];
      // prompt user for next input value
      _index2.default.prompts.inputs(input.title, response);
    } else {
      // we've finished all inputs, delete then delegate :)
      dtd('inputs', config);
    }
  };

  // start user input prompts
  _index2.default.prompts.inputs(input.title, response);
};

/*
 * Files config handler
 * - store files and their output path for creation later then send to delegate
 */
var files = function files(config) {
  _index2.default.files.store(config.files, basePath, function () {
    return dtd('files', config);
  });
};

/*
 * Handle config options
 */
var choices = function choices(configs) {
  var data = {};
  var configTitles = [];

  // send user choice response configuration to delegate
  var response = function response(choice) {
    if (data[choice.choices]) {
      dtd(null, data[choice.choices]);
    }
  };

  // prompt user with new config options
  var newConfigPrompt = function newConfigPrompt(newConfig) {
    configTitles.push(newConfig.title);
    data[newConfig.title] = newConfig;

    if (Object.keys(data).length === configs.length) {
      _index2.default.prompts.choices(configTitles, response);
    }
  };

  // Prompt user for configuration choices
  // strings are expected to be a path to a .json config
  // objects are expected to be a new config (files, vars, etc)
  configs.forEach(function (option) {
    if (typeof option === 'string') {
      _index2.default.files.tplContent(option, function (newConfig) {
        return newConfigPrompt(_hanson2.default.parse(newConfig));
      });
    } else if ((typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object') {
      newConfigPrompt(option);
    }
  });
};

/*
 * Delegate configs to various handlers
 */
var delegate = function delegate(config) {
  if (config.directory) {
    basePath += '/' + config.directory;
    dtd('directory', config);
  } else if (config.vars) {
    vars(config);
  } else if (config.inputs) {
    inputs(config);
  } else if (config.files) {
    files(config);
  } else if (config.choices) {
    choices(config.choices);
  } else {
    _index2.default.files.createStoreFiles(function () {
      console.log('Success!'.white.underline, 'Files created'); // eslint-disable-line
    });
  }
};

exports.default = delegate;