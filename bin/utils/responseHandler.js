'use strict';

var _prompts = require('./prompts.js');

var _prompts2 = _interopRequireDefault(_prompts);

var _config = require('./config.js');

var _vars = require('./vars.js');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import filesUtil from './files.js';

/*
 * Delegate response to proper handler
 */
var delegate = function delegate(answer, active) {
  // console.log('\n----  delegate\n');
  // console.info('answer:', answer);
  // console.log('-');
  // console.info('active:', active);
  // console.log('-');

  // get answer type
  var choices = answer.choices;


  if (choices) {
    var choiceNames = active.choices.map(function (choice) {
      return choice.name;
    });
    var choiceIndex = choiceNames.indexOf(choices);
    _prompts2.default.config(active.choices[choiceIndex]);
  }

  // // handler answers based on type
  // if (config) {
  //   subtypeResponse(initial);
  // } else if (subtype) {
  //   subtypeResponse(subtype);
  // } else if (name) {
  //   nameResponse(name);
  // }
};

/*
 * Export delegate
 */
// libs
module.exports = {
  delegate: delegate
};

/*
 * active config reference to traverse config tree
 * while still maintaing access to complete config
 */
// let activeConfig = config;

/*
 * Handle name prompt response
 */
// function nameResponse(name) {
//   // get values from config
//   let { root, files, directory } = activeConfig;
//
//   const fileConfig = {
//     root,
//     files,
//     directory,
//     name
//   };
//
//   // Ensure required values are passed
//   if (!root) {
//     throw Error(`${type} config is missing a root directory`);
//   } else if (!files) {
//     throw Error(`${type} config is missing a files configuration object`);
//   }
//
//   // Create new files
//   filesUtil.createFiles(fileConfig);
// };

/*
 * Handle subtype prompt response
 */
// function subtypeResponse(subtype) {
//   // file type object keys
//   const fileTypes = JSON.stringify(['files', 'root']);
//
//   // update config object
//   activeConfig = activeConfig[subtype];
//
//   // use object keys for subtype choices
//   // sort alphabetically for proper comparison
//   const choices = Object.keys(activeConfig);
//   choices.sort();
//
//   console.log(choices);
//
//   const root = (choices.indexOf('root') > -1);
//   const git = (choices.indexOf('git') > -1) && root;
//   const plate = (choices.indexOf('plate') > -1) && root;
//   const file = (choices.indexOf('file') > -1) && root;
//   const files = (choices.indexOf('files') > -1) && root;
//
//   // display proper prompts
//   // if (nameChoices) {
//   //   prompts.name();
//   // } else {
//   //   prompts.subtype(choices);
//   // }
// };