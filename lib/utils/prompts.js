// libs
import inquirer from 'inquirer';


/*
 * Prompt for config choices
 */
const choices = (_choices, cb) => {
  inquirer.prompt([{
    name: 'choices',
    message: 'What do you need?',
    type: 'list',
    default: 0,
    choices: _choices.sort(),
  }], cb);
};


/*
 * Prompt for selectable options
 */
const options = (choices, cb) => {
  const _choices = choices.map(choice => ({ name: choice, checked: true })).sort();

  inquirer.prompt([{
    name: 'options',
    message: 'Options:',
    type: 'checkbox',
    choices: _choices,
  }], cb);
};


/*
 * Prompt for custom input values
 */
const inputs = (input, cb) => {
  inquirer.prompt([{
    name: 'input',
    message: input,
    type: 'input',
  }], cb);
};


/*
 * Prompt for user confirmation
 */
const confirmation = (message, cb) => {
  inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message,
  }], cb);
};


/*
 * Prompt exports
 */
export default {
  choices,
  options,
  inputs,
  confirmation,
};
