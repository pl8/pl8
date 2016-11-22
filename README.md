![pl8](http://i.imgur.com/TDfXqX0.png)
# PL8
The most simple boilerplate generator in the universe.


## Table of Contents
- [About](#about)
- [Installation](#installation)
- [Demo](#demo)
- [Example](#example)


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


## Example
All paths and files correspond to the `examples/` directory.

###### pl8rc.json config
``` js
{
  title: 'PL8 Config Examples',
  directory: 'examples/output', // outputs all files to this directory
  // config path strings or objects are accepted
  choices: [
    // config path string examples
    'examples/configs/react-component.json',
    'examples/configs/java-class.json',
    'examples/configs/css-button.json',
    'examples/configs/angular-component.json',
    'examples/configs/ruby-controller.json',
  ]
}
```

###### react-component.json configuration
``` js
{
  title: 'React Component',
  directory: 'React/{pl8.name}', // outputs files to React/ sub directory with name input value
  inputs: [{
    title: 'Component name?:', // user prompt message
    ref: 'name' // replaces all {pl8.name} references with user input value
  }],
  files: [{
    name: '{pl8.name}.js', // file name and extension
    // tpl attribute imports local files as templates
    tpl: 'examples/templates/react-component.jsx'
  }, {
    name: '{pl8.name}.css',
    // content attribute uses string as content template
    content: '.{pl8.name} {}'
  }, {
    name: '{pl8.name}__tests.js',
    // git attribute used for github resource template
    git: 'https://github.com/justinsisley/pl8/blob/master/examples/templates/react-e2e.js'
  }]
}
```
