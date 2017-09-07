<sub>Based on [airbnb/babel-plugin-dynamic-import-node](https://github.com/airbnb/babel-plugin-dynamic-import-node)</sub>
# babel-plugin-async-import [![travis-ci](https://travis-ci.org/bernardmcmanus/babel-plugin-async-import.svg)](https://travis-ci.org/bernardmcmanus/babel-plugin-async-import)
> Platform-agnostic asynchronous imports

```js
const getPageContainer = memoize(async name => await (
  await import(`./pages/${name}`)
).default);
```

* Transpiles to code that can run on server and in browser
* Full support for code splitting *and* SSR
* Node 4+

## Usage

##### .babelrc
```js
{
  plugins: ['async-import']
}
```
