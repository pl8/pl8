'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _simpleGit = require('simple-git');

var _simpleGit2 = _interopRequireDefault(_simpleGit);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _urls = require('../constants/urls.js');

var _urls2 = _interopRequireDefault(_urls);

var _directories = require('../constants/directories.js');

var _directories2 = _interopRequireDefault(_directories);

var _files = require('./files.js');

var _files2 = _interopRequireDefault(_files);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Create temporary directories for files
 */
var _tmpDirs = function _tmpDirs(paths) {
  var tmpDir = _directories2.default.gitTmp + '/' + paths.repo;

  try {
    if (_fs2.default.lstatSync(tmpDir)) {
      _files2.default.removeTmpDirs();
    }
  } catch (err) {
    console.log(_colors2.default.red.under('Error:'), err); // eslint-disable-line
  }

  _mkdirp2.default.sync(tmpDir);
};

/*
 * Configure git vars from path
 */
/*
 * Libs
 */
var pathVars = function pathVars(path) {
  // raw file path to get blob data
  var rawUrl = path.indexOf(_urls2.default.githubRaw) === 0;

  // remove github url from path
  var gitPath = void 0;
  if (path.indexOf('.com/') > -1) {
    gitPath = path.split('.com/')[1].split('/');
  } else {
    gitPath = path.split('/');
  }

  // author name
  var author = gitPath[0];

  // repository name
  var repo = gitPath[1];

  // get vars based on raw or standard url type
  var type = void 0;
  var branch = void 0;
  var dirs = void 0;

  if (rawUrl) {
    type = 'blob'; // git doesn't support raw paths for directories
    branch = gitPath[2];
    dirs = gitPath.slice(3, gitPath.length - 1).join('/');
  } else {
    type = gitPath[2];
    branch = gitPath[3];
    dirs = gitPath.slice(4, gitPath.length - 1).join('/');
  }

  // file / dir to get contents from
  var file = gitPath[gitPath.length - 1];

  // raw url path (used for quicker get requests)
  var raw = void 0;
  if (rawUrl || type === 'blob') {
    raw = _urls2.default.githubRaw + '/' + author + '/' + repo + '/' + branch + '/' + dirs + '/' + file;
  }

  // tpl path to copy contents from
  var tplPath = _directories2.default.gitTmp + '/' + repo;
  tplPath += dirs ? '/' + dirs : '';
  tplPath += file ? '/' + file : '';

  return {
    author: author,
    repo: repo,
    dirs: dirs,
    file: file,
    branch: branch,
    type: type,
    raw: raw,
    tplPath: tplPath
  };
};

/*
 * Clone repo to get contents
 */
var cloneRepo = function cloneRepo(paths, callback) {
  var clonePath = _urls2.default.github + '/' + paths.author + '/' + paths.repo + '.git';
  _tmpDirs(paths);
  (0, _simpleGit2.default)(_directories2.default.gitTmp).clone(clonePath, paths.repo, function (err) {
    if (err) {
      console.log(_colors2.default.red.underline('Error:'), err); // eslint-disable-line
    }

    _files2.default.tplContent(paths.tplPath, callback);
  });
};

/*
 * Exports
 */
exports.default = {
  cloneRepo: cloneRepo,
  pathVars: pathVars
};