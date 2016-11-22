/*
 * Libs
 */
import fs from 'fs';
import hanson from 'hanson';
import errors from '../constants/errors.js';


/*
 * Config for pl8
 */
let config = {};


/*
 * Configuration file path
 */
const configFile = `${process.cwd()}/pl8rc.json`;


/*
 * Make sure pl8rc.json config file exists
 */
try {
  config = fs.readFileSync(configFile, 'utf8');
} catch (err) {
  config = errors.MISSING;
}


/*
 * Ensure valid relaxed json configuration
 */
const relaxedConfig = hanson.parse(config);
if (config !== errors.MISSING) {
  try {
    config = relaxedConfig;
  } catch (err) {
    config = errors.INVALID;
  }
}


/*
 * Exports
 */
module.exports = {
  config,
};

