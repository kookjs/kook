// ts-node modules/utils/examples/interopDefault/index.ts

import { interopDefault } from '@khanakiajs/util'

const cEs5 = require('./config_es5.ts')
console.log('ES5', cEs5)
console.log('interopDefault', interopDefault(cEs5))

const cEs6 = require('./config_es6.ts')
console.log('ES6', cEs6)
console.log('interopDefault', interopDefault(cEs6))
