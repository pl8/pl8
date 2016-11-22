/*
 * Libs
 */
import utils from './index.js';


/*
 * variables object
 */
const vars = {};


/*
 * Get single value for key from variables
 */
const get = (ref) => vars[ref];


/*
 * Get all variables
 */
const all = () => vars;


/*
 * Get variable keys
 */
const keys = () => Object.keys(vars);


/*
 * Get variable vals
 */
const vals = () => keys().map(key => vars[key]);


/*
 * Get content and set values for variables config
 */
const set = (variables, callback) => {
  // get variables refs
  const refs = variables.map(variable => variable.ref);

  // get contents for all variables
  variables.forEach(variable => {
    // get and set content for variable
    utils.files.getContent(variable, (content) => {
      vars[variable.ref] = content;

      // callback once all variables have been set
      const refKeys = keys();
      let missingRef = false;
      refs.forEach((ref, index) => {
        if (refKeys.indexOf(ref) === -1) {
          missingRef = true;
        }

        if (index === refs.length - 1 && !missingRef) {
          callback();
        }
      });
    });
  });
};


/*
 * Set single variable value
 */
const setRef = (key, val) => {
  vars[key] = val;
};


/*
 * Replace ref variables with proper content in strings
 */
const replaceVarsInString = (string) => {
  let newString = string;
  const refs = keys();
  const values = vals();

  refs.forEach((ref, index) => {
    if (newString) {
      newString = newString.replace(new RegExp(`{pl8.${ref}}`, 'g'), values[index]);
    }
  });

  return newString;
};


/*
 * Remove unused ref variables from string
 */
const removeUnusedVars = (string) => string.replace(/(?={pl8).*}\s/g, '');


/*
 * Exports
 */
module.exports = {
  set,
  setRef,
  get,
  all,
  keys,
  vals,
  replaceVarsInString,
  removeUnusedVars,
};
