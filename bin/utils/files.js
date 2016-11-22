'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Storage for files to create
 */
// libs
var storage = {};

/*
 * Create directory
 */
var createDir = function createDir(path) {
  var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

  var directoryExists = void 0;
  var newPath = _index2.default.vars.replaceVarsInString(path);

  try {
    if (_fs2.default.lstatSync(newPath)) {
      directoryExists = true;
    }
  } catch (err) {}
  // no op


  // don't create new directory if it already exists
  if (!directoryExists) {
    _mkdirp2.default.sync(newPath);
  }

  cb();
};

/*
 * Get contents from local template file
 */
var tplContent = function tplContent(path, callback) {
  var filePath = process.cwd() + '/' + path;
  callback(_fs2.default.readFileSync(filePath, 'utf8'));
};

/*
 * Get content from url
 */
var urlContent = function urlContent(path, callback) {
  (0, _request2.default)(path, function (err, response, body) {
    if (!err && response.statusCode === 200) {
      callback(body);
    } else {
      throw err;
    }
  });
};

/*
 * Get content from git repo
 */
var gitContent = function gitContent(path, callback) {
  var paths = _index2.default.git.pathVars(path);

  if (paths.raw) {
    urlContent(paths.raw, callback);
  } else {
    _index2.default.git.cloneRepo(paths, callback);
  }
};

/*
 * Get file content handler
 */
var getContent = function getContent(file, callback) {
  if (file.content) {
    callback(file.content);
  } else if (file.tpl) {
    tplContent(file.tpl, callback);
  } else if (file.git) {
    gitContent(file.git, callback);
  } else if (file.url) {
    urlContent(file.url, callback);
  }
};

/*
 * Create single file
 */
var createFile = function createFile(path, content, cb) {
  var fileExists = void 0;
  var newPath = _index2.default.vars.replaceVarsInString(path);
  newPath = _index2.default.vars.removeUnusedVars(newPath);

  try {
    if (_fs2.default.lstatSync(newPath)) {
      fileExists = true;
    }
  } catch (err) {
    // no op
  }

  var callback = function callback() {
    if (cb) {
      cb();
    }
  };

  var newContent = _index2.default.vars.replaceVarsInString(content);
  newContent = _index2.default.vars.removeUnusedVars(newContent);

  if (fileExists) {
    var splitPath = newPath.split('/');
    var message = 'Are you sure you\'d like to overwrite ' + splitPath[splitPath.length - 1] + '?';
    var response = function response(answer) {
      if (answer.confirm) {
        _fs2.default.writeFileSync(newPath, newContent);
      }
      callback();
    };

    _index2.default.prompts.confirmation(message, response);
  } else {
    _fs2.default.writeFileSync(newPath, newContent);
    callback();
  }
};

/*
 * Add files to storage for creation later
 */
var store = function store(files, path, cb) {
  files.forEach(function (file, index) {
    // configure output path
    var filePath = path;
    if (file.directory) {
      filePath += '/' + file.directory;
    }

    // get content then add to storage
    getContent(file, function (content) {
      // setup path config object if it hasn't already been made
      if (!storage[filePath]) {
        storage[filePath] = {};
      }

      // store file creation info
      storage[filePath][file.name] = content;
      if (index === files.length - 1) {
        cb();
      }
    });
  });
};

/*
 * Create all files in storage
 */
var createStoreFiles = function createStoreFiles(done) {
  // start directory creation
  var dirs = Object.keys(storage);
  var dirIndex = 0;
  var dir = dirs[dirIndex];

  // start file creation
  var files = storage[dir];
  var names = Object.keys(files);
  var fileIndex = 0;
  var fileName = names[fileIndex];
  var fileContent = files[fileName];

  // move on to next file for creation
  var createNextFile = function createNextFile() {
    ++fileIndex;

    if (fileIndex !== names.length) {
      fileName = names[fileIndex];
      fileContent = files[fileName];
      createFile(dir + '/' + fileName, fileContent, createNextFile);
    } else {
      createNextDir(); //eslint-disable-line
    }
  };

  // move on to next directory for file/s creation
  var createNextDir = function createNextDir() {
    ++dirIndex;

    if (dirIndex !== dirs.length) {
      (function () {
        dir = dirs[dirIndex];
        files = storage[dir];
        names = Object.keys(files);
        fileIndex = 0;
        fileName = names[fileIndex];
        fileContent = files[fileName];
        var path = _index2.default.vars.replaceVarsInString(dir + '/' + fileName);
        createDir(dir, function () {
          return createFile(path, fileContent, createNextFile);
        });
      })();
    } else {
      done();
    }
  };

  createDir(dir, function () {
    return createFile(dir + '/' + fileName, fileContent, createNextFile);
  });
};

/*
 * Exports
 */
module.exports = {
  createFile: createFile,
  createDir: createDir,
  gitContent: gitContent,
  urlContent: urlContent,
  tplContent: tplContent,
  getContent: getContent,
  store: store,
  createStoreFiles: createStoreFiles
};