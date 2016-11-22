import colors from 'colors/safe';
import errors from './constants/errors.js';
import utils from './utils';
import { config } from './utils/config.js';

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
  console.log(err, colors.white('Missing pl8rc.json config file')); // eslint-disable-line
} else if (error.invalid) {
  console.log(err, colors.white('There was an issue parsing pl8rc.json. Please validate JSON.')); // eslint-disable-line
} else if (!config.choices && !config.files && !config.configs) {
  console.log(err, colors.white('Config missing choices and output files.')); // eslint-disable-line
} else {
  // show base config title
  if (config.title) {
    console.log(colors.white(`\n${config.title}\n`).underline); // eslint-disable-line
  }

  // send to delegate to handle config
  utils.delegate(config);
}

