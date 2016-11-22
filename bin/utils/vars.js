'use strict';

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * variables object
 */
var vars = {};

/*
 * Get single value for key from variables
 */
/*
 * Libs
 */
var get = function get(ref) {
  return vars[ref];
};

/*
 * Get all variables
 */
var all = function all() {
  return vars;
};

/*
 * Get variable keys
 */
var keys = function keys() {
  return Object.keys(vars);
};

/*
 * Get variable vals
 */
var vals = function vals() {
  return keys().map(function (key) {
    return vars[key];
  });
};

/*
 * Get content and set values for variables config
 */
var set = function set(variables, callback) {
  // get variables refs
  var refs = variables.map(function (variable) {
    return variable.ref;
  });

  // get contents for all variables
  variables.forEach(function (variable) {
    // get and set content for variable
    _index2.default.files.getContent(variable, function (content) {
      vars[variable.ref] = content;

      // callback once all variables have been set
      var refKeys = keys();
      var missingRef = false;
      refs.forEach(function (ref, index) {
        if (refKeys.indexOf(ref) === -1) {
          missingRef = true;
        }

        if (index === refs.length - 1 && !missingRef) {
          callback();
        }
      });
    });
  });
};

/*
 * Set single variable value
 */
var setRef = function setRef(key, val) {
  vars[key] = val;
};

/*
 * Replace ref variables with proper content in strings
 */
var replaceVarsInString = function replaceVarsInString(string) {
  var newString = string;
  var refs = keys();
  var values = vals();

  refs.forEach(function (ref, index) {
    if (newString) {
      newString = newString.replace(new RegExp('{pl8.' + ref + '}', 'g'), values[index]);
    }
  });

  return newString;
};

/*
 * Remove unused ref variables from string
 */
var removeUnusedVars = function removeUnusedVars(string) {
  return string.replace(/(?={pl8).*}\s/g, '');
};

/*
 * Exports
 */
module.exports = {
  set: set,
  setRef: setRef,
  get: get,
  all: all,
  keys: keys,
  vals: vals,
  replaceVarsInString: replaceVarsInString,
  removeUnusedVars: removeUnusedVars
};