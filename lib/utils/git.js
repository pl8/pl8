/*
 * Libs
 */
import fs from 'fs';
import git from 'simple-git';
import mkdirp from 'mkdirp';
import colors from 'colors';
import urls from '../constants/urls.js';
import directories from '../constants/directories.js';
import files from './files.js';


/*
 * Create temporary directories for files
 */
const _tmpDirs = (paths) => {
  const tmpDir = `${directories.gitTmp}/${paths.repo}`;

  try {
    if (fs.lstatSync(tmpDir)) {
      files.removeTmpDirs();
    }
  } catch (err) {
    console.log(colors.red.under('Error:'), err); // eslint-disable-line
  }

  mkdirp.sync(tmpDir);
};


/*
 * Configure git vars from path
 */
const pathVars = (path) => {
  // raw file path to get blob data
  const rawUrl = (path.indexOf(urls.githubRaw) === 0);

  // remove github url from path
  let gitPath;
  if (path.indexOf('.com/') > -1) {
    gitPath = path.split('.com/')[1].split('/');
  } else {
    gitPath = path.split('/');
  }

  // author name
  const author = gitPath[0];

  // repository name
  const repo = gitPath[1];

  // get vars based on raw or standard url type
  let type;
  let branch;
  let dirs;

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
  const file = gitPath[gitPath.length - 1];

  // raw url path (used for quicker get requests)
  let raw;
  if (rawUrl || type === 'blob') {
    raw = `${urls.githubRaw}/${author}/${repo}/${branch}/${dirs}/${file}`;
  }

  // tpl path to copy contents from
  let tplPath = `${directories.gitTmp}/${repo}`;
  tplPath += (dirs) ? `/${dirs}` : '';
  tplPath += (file) ? `/${file}` : '';

  return {
    author,
    repo,
    dirs,
    file,
    branch,
    type,
    raw,
    tplPath,
  };
};


/*
 * Clone repo to get contents
 */
const cloneRepo = (paths, callback) => {
  const clonePath = `${urls.github}/${paths.author}/${paths.repo}.git`;
  _tmpDirs(paths);
  git(directories.gitTmp).clone(clonePath, paths.repo, (err) => {
    if (err) {
      console.log(colors.red.underline('Error:'), err); // eslint-disable-line
    }

    files.tplContent(paths.tplPath, callback);
  });
};


/*
 * Exports
 */
export default {
  cloneRepo,
  pathVars,
};
