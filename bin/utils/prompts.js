'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Prompt for config choices
 */
var choices = function choices(_choices, cb) {
  _inquirer2.default.prompt([{
    name: 'choices',
    message: 'What do you need?',
    type: 'list',
    default: 0,
    choices: _choices.sort()
  }], cb);
};

/*
 * Prompt for selectable options
 */
// libs
var options = function options(choices, cb) {
  var _choices = choices.map(function (choice) {
    return { name: choice, checked: true };
  }).sort();

  _inquirer2.default.prompt([{
    name: 'options',
    message: 'Options:',
    type: 'checkbox',
    choices: _choices
  }], cb);
};

/*
 * Prompt for custom input values
 */
var inputs = function inputs(input, cb) {
  _inquirer2.default.prompt([{
    name: 'input',
    message: input,
    type: 'input'
  }], cb);
};

/*
 * Prompt for user confirmation
 */
var confirmation = function confirmation(message, cb) {
  _inquirer2.default.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: message
  }], cb);
};

/*
 * Prompt exports
 */
exports.default = {
  choices: choices,
  options: options,
  inputs: inputs,
  confirmation: confirmation
};