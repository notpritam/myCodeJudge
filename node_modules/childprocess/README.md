childprocess
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![appveyor build status][appveyor-image]][appveyor-url]
[![Test coverage][cov-image]][cov-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/childprocess.svg?style=flat-square
[npm-url]: https://npmjs.org/package/childprocess
[travis-image]: https://img.shields.io/travis/node-modules/childprocess.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/childprocess
[appveyor-image]: https://ci.appveyor.com/api/projects/status/aeh1v06b88nb7ok9?svg=true
[appveyor-url]: https://ci.appveyor.com/project/fengmk2/childprocess
[cov-image]: https://codecov.io/github/node-modules/childprocess/coverage.svg?branch=master
[cov-url]: https://codecov.io/github/node-modules/childprocess?branch=master
[david-image]: https://img.shields.io/david/node-modules/childprocess.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/childprocess
[download-image]: https://img.shields.io/npm/dm/childprocess.svg?style=flat-square
[download-url]: https://npmjs.org/package/childprocess

Inject script into multiple process when using `child_process.fork`.

One of the use case is [Multiple Process Code Coverage](https://github.com/gotwarlost/istanbul#multiple-process-usage) with [istanbul].

- [cluster code coverage with istanbul](http://fengmk2.com/blog/2015/cluster-coverage/README.html)

## Install

```bash
$ npm i childprocess
```

## Usage

```js
require('childprocess').inject(function(modulePath, args, opt) {
  const execFile = 'path/to/istanbul';
  const cwd = opt.cwd && process.cwd();
  const execArgs = [
    'cover',
    '--root', cwd,
    '--dir', path.join(cwd, './coverage'),
    '--report', 'none',
    '--print', 'none',
    '--include-pid',
    modulePath,
    '--',
  ].concat(args);
  return [execFile, execArgs, opt];
});
require('child_process').fork();
```

## APIs

## inject(cb) / inject(filepath)

Inject script when using `child_process.fork`.

The inject script is a function that running in sandbox in every process. that mean you can't use the variable out of the function.

The function should return an array that contains 3 arguments same as fork.

```js
childprocess.inject(function(modulePath, args, opt) {
  return [modulePath, args, opt];
});
```

### reset()

Use `child_process.fork` without injected script.

## License

[MIT](LICENSE)

[istanbul]: https://github.com/gotwarlost/istanbul
