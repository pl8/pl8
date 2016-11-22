// libs
import fs from 'fs';
import request from 'request';
import mkdirp from 'mkdirp';
import utils from './index.js';

/*
 * Storage for files to create
 */
const storage = {};


/*
 * Create directory
 */
const createDir = (path, cb = () => {}) => {
  let directoryExists;
  const newPath = utils.vars.replaceVarsInString(path);

  try {
    if (fs.lstatSync(newPath)) {
      directoryExists = true;
    }
  } catch (err) {
    // no op
  }

  // don't create new directory if it already exists
  if (!directoryExists) {
    mkdirp.sync(newPath);
  }

  cb();
};


/*
 * Get contents from local template file
 */
const tplContent = (path, callback) => {
  const filePath = `${process.cwd()}/${path}`;
  callback(fs.readFileSync(filePath, 'utf8'));
};


/*
 * Get content from url
 */
const urlContent = (path, callback) => {
  request(path, (err, response, body) => {
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
const gitContent = (path, callback) => {
  const paths = utils.git.pathVars(path);

  if (paths.raw) {
    urlContent(paths.raw, callback);
  } else {
    utils.git.cloneRepo(paths, callback);
  }
};


/*
 * Get file content handler
 */
const getContent = (file, callback) => {
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
const createFile = (path, content, cb) => {
  let fileExists;
  let newPath = utils.vars.replaceVarsInString(path);
  newPath = utils.vars.removeUnusedVars(newPath);

  try {
    if (fs.lstatSync(newPath)) {
      fileExists = true;
    }
  } catch (err) {
    // no op
  }

  const callback = () => {
    if (cb) {
      cb();
    }
  };

  let newContent = utils.vars.replaceVarsInString(content);
  newContent = utils.vars.removeUnusedVars(newContent);

  if (fileExists) {
    const splitPath = newPath.split('/');
    const message = `Are you sure you'd like to overwrite ${splitPath[splitPath.length - 1]}?`;
    const response = (answer) => {
      if (answer.confirm) {
        fs.writeFileSync(newPath, newContent);
      }
      callback();
    };

    utils.prompts.confirmation(message, response);
  } else {
    fs.writeFileSync(newPath, newContent);
    callback();
  }
};


/*
 * Add files to storage for creation later
 */
const store = (files, path, cb) => {
  files.forEach((file, index) => {
    // configure output path
    let filePath = path;
    if (file.directory) {
      filePath += `/${file.directory}`;
    }

    // get content then add to storage
    getContent(file, content => {
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
const createStoreFiles = (done) => {
  // start directory creation
  const dirs = Object.keys(storage);
  let dirIndex = 0;
  let dir = dirs[dirIndex];

  // start file creation
  let files = storage[dir];
  let names = Object.keys(files);
  let fileIndex = 0;
  let fileName = names[fileIndex];
  let fileContent = files[fileName];
  const fileNames = [fileName];

  // move on to next file for creation
  const createNextFile = () => {
    ++fileIndex;

    if (fileIndex !== names.length) {
      fileName = names[fileIndex];
      fileContent = files[fileName];
      fileNames.push(fileName);
      createFile(`${dir}/${fileName}`, fileContent, createNextFile);
    } else {
      createNextDir(); //eslint-disable-line
    }
  };

  // move on to next directory for file/s creation
  const createNextDir = () => {
    ++dirIndex;

    if (dirIndex !== dirs.length) {
      dir = dirs[dirIndex];
      files = storage[dir];
      names = Object.keys(files);
      fileIndex = 0;
      fileName = names[fileIndex];
      fileContent = files[fileName];
      fileNames.push(fileName);
      const path = utils.vars.replaceVarsInString(`${dir}/${fileName}`);
      createDir(dir, () => createFile(path, fileContent, createNextFile));
    } else {
      done(fileNames);
    }
  };

  createDir(dir, () => createFile(`${dir}/${fileName}`, fileContent, createNextFile));
};


/*
 * Exports
 */
module.exports = {
  createFile,
  createDir,
  gitContent,
  urlContent,
  tplContent,
  getContent,
  store,
  createStoreFiles,
};

