<p align="center">
  <a href="https://kook.khanakia.com/" target="blank"><img src="https://avatars2.githubusercontent.com/u/66347265?s=400&u=b1b91a259fdc55c20a14b18b144ca6af4ed33931&v=4" width="70" alt="Kook Js Logo" /></a>
</p>


[![Node.js CI](https://github.com/node-cache/node-cache/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/node-cache/node-cache/actions?query=workflow%3A%22Node.js+CI%22+branch%3A%22master%22)
![Dependency status](https://img.shields.io/david/node-cache/node-cache)

### A Helper Library with many useful methods.


Check examples directory [examples](https://github.com/kookjs/kook/tree/master/modules/util/examples)


## API
## sleep
Test if values is number or not
@Returns Boolan (TRUE | FALSE)
```js
import { sleep } from '@khanakiajs/util'
await sleep(10000) // Wait for 10 seconds
console.log('Hello world')
```

## isNumber
Test if values is number or not
@Returns Boolan (TRUE | FALSE)
```js
import { isNumber } from '@khanakiajs/util'
isNumber(10) // False
```

## isString
Test if value is string or not
@Returns Boolan (TRUE | FALSE)
```js
import { isString } from '@khanakiajs/util'
isString('string') // True
```

## debugConsoleLog
 Did you ever have phantom console.log - or more specifically you've no idea where it was happening? Upgrading log to show where logging is happening. Just run this function before your code it will show you which file or function the console.log is running from
@Returns void
```js
import { debugConsoleLog } from '@khanakiajs/util'
debugConsoleLog()
console.log('test')
// Output: test at Object.<anonymous> (/modules/utils/examples/debugconsole.ts:5:9)
```

## interopDefault
 * Get classname from ES6 module or Node.js require
 * While importing async/await like const c = await import("../c") -> ES6 it returns classname in c.default but when we require demo = rqeuire("../c") then it return direct classname
 * If export default Class => class.default but if we do module.exports = Class => Class
 * So this function automatically detect the module type and resolve the class 
@Returns Class
```js
import { interopDefault } from '@khanakiajs/util'

const cEs5 = require('./config_es5.ts')
console.log('ES5', cEs5) // ES5 { name: 'Example' }
console.log('interopDefault', interopDefault(cEs5)) // interopDefault { name: 'Example' }

const cEs6 = require('./config_es6.ts')
console.log('ES6', cEs6) // ES6 { default: { name: 'Example' } }
console.log('interopDefault', interopDefault(cEs6)) // interopDefault { name: 'Example' }
```

## getGlobalVariable
Returns the NodeJS.Global variable object and ignore the Typescript strict checking automatically
```js
import { getGlobalVariable } from '@khanakiajs/util'
console.log(getGlobalVariable()) // global
```


## Contribute

If you would like to contribute to the project, please fork it and send us a pull request.  Please add tests
for any new features or bug fixes.

## Stay in touch

* Author - [Aman Khanakia](https://twitter.com/mrkhanakia)
* Website - [https://kook.khanakia.com](https://kook.khanakia.com/)

## License

Cache RDBMS is [MIT licensed](LICENSE).
