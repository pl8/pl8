![pl8](http://i.imgur.com/TDfXqX0.png)
# PL8
The most simple boilerplate generator in the universe.


## Table of Contents
- [About](#about)
- [Installation](#installation)
- [Demo](#demo)
- [Documentation](#documentation)
- [Example Config](#example-config)


## About
PL8 is a boilerplate generator focusing on simplicity, ease of use and extensibility.
It doesn’t care what language or file type you want to use. Java? CSS? Python? No problem!
Need to create some boilerplates? PL8 makes it easy!

- PL8 doesn't care about your tech. Java? React? SASS? It won't argue with you.
- PL8 doesn't care if you want to use Yeoman or another generator. It will still help out.
- PL8 uses a simple JSON configuration file, don't waste time with building custom generators.


## Installation
1. Install npm package globally: `npm i -g pl8`
2. Place a `pl8rc.json` config file in root of project directory.
3. Run `plt` or `pl8` from project root to open prompt for boilerplate generation.


## Demo
![Preview](http://g.recordit.co/6QeNvdSQWo.gif)


## Documentation
- [Title](#title)
- [Directory](#directory)
- [Vars](#vars)
- [Inputs](#inputs)
- [Files](#files)
- [Choices](#choices)
- [Example Config](#example-config)

#### Title: `String`
Title of PL8 configuration, acts as the initial prompt header.

``` js
{
  title: 'Boilerplates:'
}
```

#### Directory: `String`
Output directory for new files.

``` js
{
  directory: 'output/files'
}
```

#### Vars: `Array`
Static variables to replace in boilerplate templates for new files.

``` js
{
  vars: [{
    ref: 'name', // pl8 variable for replacement ... {pl8.name} = HelloWorld
    content: 'HelloWorld',
    // accepts tpl: 'path/to/tpl.ext' ... path to local template
    // accepts git: 'github.resource.url' ... url to github resource as template
  }]
}
```

#### Inputs: `Array`
Allow user to input custom variables for boilerplate templates.

``` js
{
  inputs: [{
    title: 'What is the component name?', // prompt message to show user
    ref: 'component', // pl8 variable for replacement ... {pl8.component} = User input value
  }]
}
```

#### Files: `Array`
Files to output from boilerplate templates.

``` js
{
  files: [{
    name: 'index.js', // creates index.js file
    content: 'export default {}'
  }, {
    name: '{pl8.name}.js', // pl8 variables will be replaced in all file names and directory paths
    tpl: 'templates/tpl.js', // accepts local template files
  }, {
    name: '{pl8.name}-e2e.js',
    git: 'https://github.com/pl8/pl8/blob/master/examples/templates/react-e2e.js', // accepts github resource urls for templates
  }]
}
```

#### Choices: `Array`
Allow users to choose between multiple boilerplate configurations.

``` js
// Object example
{
  choices: [{
    title: 'Javascript Component',
    vars: [{
      ref: 'name', // pl8 variable for replacement ... {pl8.name} = HelloWorld
      content: 'HelloWorld',
      // accepts tpl: 'path/to/tpl.ext' ... path to local template
      // accepts git: 'github.resource.url' ... url to github resource as template
    }],
    inputs: [{
      title: 'What is the component name?', // prompt message to show user
      ref: 'component', // pl8 variable for replacement ... {pl8.component} = User input value
    }],
    files: [{
      name: 'index.js', // creates index.js file
      content: 'export default {}'
    }, {
      name: '{pl8.name}.js', // pl8 variables will be replaced in all file names and directory paths
      tpl: 'templates/tpl.js', // accepts local template files
    }, {
      name: '{pl8.name}-e2e.js',
      git: 'https://github.com/pl8/pl8/blob/master/examples/templates/react-e2e.js', // accepts github resource urls for templates
    }]
  }]
}
```

``` js
// String example
{
  choices: [
    'path/to/config.json',
    'path/to/different/config.json',
  ],
}
```


## Example Config
All paths and files correspond to the `examples/` directory.

#### pl8rc.json config
``` js
// Allow user to choose config option
{
  title: 'Boilerplates:',
  directory: 'output/files', // outputs all files to this directory
  choices: [
    // string example
    'examples/configs/react-component.json',

    // object example
    {
      title: 'Javascript Component',
      vars: [{
        ref: 'name', // pl8 variable for replacement ... {pl8.name} = HelloWorld
        content: 'HelloWorld',
        // accepts tpl: 'path/to/tpl.ext' ... path to local template
        // accepts git: 'github.resource.url' ... url to github resource as template
      }],
      inputs: [{
        title: 'What is the component name?', // prompt message to show user
        ref: 'component', // pl8 variable for replacement ... {pl8.component} = User input value
      }],
      files: [{
        name: 'index.js', // creates index.js file
        content: 'export default {}'
      }, {
        name: '{pl8.name}.js', // pl8 variables will be replaced in all file names and directory paths
        tpl: 'templates/tpl.js', // accepts local template files
      }, {
        name: '{pl8.name}-e2e.js',
        git: 'https://github.com/pl8/pl8/blob/master/examples/templates/react-e2e.js', // accepts github resource urls for templates
      }]
    }
  ]
}
```

``` js
// Or create some files right away
{
  directory: 'output/files',
  files: [{
    name: 'README.md', // creates README.md file
    content: '# README',
  }],
}
```
