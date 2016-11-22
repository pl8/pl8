// libs
import utils from './index.js';
import colors from 'colors'; // eslint-disable-line
import hanson from 'hanson';


/*
 * Delete config param then send back to delegate
 * dtd: delete then delegate
 */
const dtd = (param, config) => {
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
const dir = process.cwd(); // current working directory
let basePath = dir; // base path for all output files


/*
 * Vars config handler
 * - set variables in store
 * - delete vars from config
 * - send to delegate to further handle config data
 */
const vars = (config) => {
  utils.vars.set(config.vars, () => dtd('vars', config));
};


/*
 * Inputs config handler
 * - handle inputs one at a time
 * - wait for a response before progressing to the next user input
 * - once finished, send to delegate to further handle config data
 */
const inputs = (config) => {
  // start at the first index
  let currentIndex = 0;
  let input = config.inputs[currentIndex];

  // handle prompt response
  const response = (answer) => {
    // save input value as pl8 variable
    utils.vars.setRef(input.ref, answer.input);

    // update index to process next input (if it exists)
    currentIndex += 1;
    if (currentIndex !== config.inputs.length) {
      // update current input config
      input = config.inputs[currentIndex];
      // prompt user for next input value
      utils.prompts.inputs(input.title, response);
    } else {
      // we've finished all inputs, delete then delegate :)
      dtd('inputs', config);
    }
  };

  // start user input prompts
  utils.prompts.inputs(input.title, response);
};


/*
 * Files config handler
 * - store files and their output path for creation later then send to delegate
 */
const files = (config) => {
  utils.files.store(config.files, basePath, () => dtd('files', config));
};


/*
 * Handle config options
 */
const choices = (configs) => {
  const data = {};
  const configTitles = [];

  // send user choice response configuration to delegate
  const response = (choice) => {
    if (data[choice.choices]) {
      dtd(null, data[choice.choices]);
    }
  };

  // prompt user with new config options
  const newConfigPrompt = (newConfig) => {
    configTitles.push(newConfig.title);
    data[newConfig.title] = newConfig;

    if (Object.keys(data).length === configs.length) {
      utils.prompts.choices(configTitles, response);
    }
  };

  // Prompt user for configuration choices
  // strings are expected to be a path to a .json config
  // objects are expected to be a new config (files, vars, etc)
  configs.forEach((option) => {
    if (typeof option === 'string') {
      utils.files.tplContent(option, newConfig => newConfigPrompt(hanson.parse(newConfig)));
    } else if (typeof option === 'object') {
      newConfigPrompt(option);
    }
  });
};


/*
 * Delegate configs to various handlers
 */
const delegate = (config) => {
  if (config.directory) {
    basePath += `/${config.directory}`;
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
    utils.files.createStoreFiles(() => {
      console.log('Success!'.white.underline, 'Files created'); // eslint-disable-line
    });
  }
};

export default delegate;
