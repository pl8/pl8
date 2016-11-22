'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var templateRegEx = /^\$\{(\S+)\}$/;

function replaceName(string, name) {
  return string.replace(/\{name\}/g, name);
}

function getConfigTemplate(string) {
  var matches = templateRegEx.exec(string);
  var objectPath = matches[1];
  var props = objectPath.split('.');

  var value = _config2.default;
  props.forEach(function (prop) {
    value = value[prop];
  });

  return value;
}

exports.default = function (answers) {
  var name = answers.name;
  var type = answers.type;
  var subType = answers.subType;

  var typeConfig = _config2.default[type];
  var _typeConfig = typeConfig;
  var root = _typeConfig.root;
  var files = _typeConfig.files;
  var content = _typeConfig.content;

  var singleFile = typeof files === 'string';
  var filesTemplate = templateRegEx.test(files);
  var contentTemplate = templateRegEx.test(content);

  // If this is a sub-type, drill down one more level and reset our values
  if (subType) {
    typeConfig = _config2.default[type][subType];
    root = typeConfig.root;
    files = typeConfig.files;
    content = typeConfig.content;
    singleFile = typeof files === 'string';
    filesTemplate = templateRegEx.test(files);
    contentTemplate = templateRegEx.test(content);
  }

  // Root directory is required
  if (!root) {
    throw Error(type + ' config is missing a root directory');
  }

  if (singleFile && !filesTemplate) {
    var filename = replaceName(files, name);
    var path = root + '/' + filename;

    try {
      var existingFile = _fs2.default.readFileSync(path, 'utf8');
      if (existingFile) {
        throw Error(path + ' already exists');
      }
    } catch (err) {
      // no-op
    }

    _mkdirp2.default.sync(root);
    _fs2.default.writeFileSync(path, content);
    return;
  }

  var parentDir = root + '/' + name;
  _mkdirp2.default.sync(parentDir);

  // Parse templates from other parts of the config file
  if (filesTemplate) {
    files = getConfigTemplate(files);
  }
  if (contentTemplate) {
    content = getConfigTemplate(content);
  }

  files.forEach(function (file) {
    var filename = replaceName(file, name);
    var path = parentDir + '/' + filename;
    var fileContent = replaceName(content[file], name);
    _fs2.default.writeFileSync(path, fileContent);
  });
};