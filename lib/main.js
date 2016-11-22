/* eslint no-console: "error" */
import { config } from './utils/config.js';
import errors from './constants/errors.js';
import colors from 'colors/safe';
import utils from './utils';


/*
 * Check config for errors, if none exist continue w/ prompt
 */
const error = {
  missing: (config === errors.MISSING),
  invalid: (config === errors.INVALID),
};


/*
 * Handle errors or show prompts
 */
const err = colors.red.underline('Error:');

if (error.missing) {
  console.log(err, colors.white('Missing .pl8rc config file')); // eslint-disable-line
} else if (error.invalid) {
  console.log(err, colors.white('There was an issue parsing the .pl8rc JSON content. Please validate JSON.')); // eslint-disable-line
} else if (!config.choices && !config.files && !config.configs) {
  console.log(err, colors.white('Config missing output files and config choices.')); // eslint-disable-line
} else {
  if (config.title) {
    console.log(colors.white(`${config.title}\n`).underline); // eslint-disable-line
  }
  utils.delegate(config);
}

