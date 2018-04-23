# babel-plugin-async-import [![travis-ci](https://travis-ci.org/bernardmcmanus/babel-plugin-async-import.svg)](https://travis-ci.org/bernardmcmanus/babel-plugin-async-import)
> Platform-agnostic asynchronous imports

## Overview
* Generate code that can run on server and in browser
* Full support for code splitting *and* SSR
* Node 4+

```js
const getPageContainer = memoize(async name => await (
  await import(`./pages/${name}`)
).default);
```

## Usage

##### .babelrc.js
```js
module.exports = {
  plugins: [
    // Default options
    ['async-import', {
      // browser: 'import(REQUEST)',
      // node: 'Promise.resolve(require(REQUEST))'
    }],

    // Common template
    ['async-import', {
      template: 'myCustomImport(REQUEST)'
    }],
  ]
};
```

Use `BABEL_TARGET` to choose the output template:
```shell
BABEL_TARGET=browser babel src --copy-files --out-dir dist

BABEL_TARGET=node babel src --copy-files --out-dir dist
```

## Performance
Consider a simple application with the following structure:
```bash
App
 ├── Page1
 ├── Page2
 ├── Page3
 └── Page4
```

Bundling with [webpack](https://github.com/webpack/webpack) yields:
```bash
# static import
 main.dfdad3d5930fe00fd037.js       526 kB      0  [emitted]  [big]  main

# require.ensure
chunk.0.6440f6c153085827a48b.js    24.3 kB      0  [emitted]
   main.943ecc70fec31c6444f4.js     503 kB      1  [emitted]  [big]  main

# async import
chunk.0.9491e6c24e3b87d1d63f.js    12.9 kB      0  [emitted]
chunk.1.f37226ca0aefdcb8b991.js     3.7 kB      1  [emitted]
chunk.2.84348279875f5fba6e99.js    3.74 kB      2  [emitted]
chunk.3.c7cdc567dea9bd59569a.js    3.71 kB      3  [emitted]
   main.058200e44cf45d9723b4.js     503 kB      4  [emitted]  [big]  main
```
