## Cache Manger Plugin for Kook.js

### HOW TO USE
Create a new config file in config/cache.ts and you can register your connnections like below
```
// import { env } from '@kookjs/core'
const { env } = require('@kookjs/core')
module.exports = {
  'default' : 'database',

  'stores' : [
    {
      name: "memory",
      driver: "memory",
    },

    {
      name: "database",
      driver: "database",
      connectionName: 'default'
    },
  ],

  prefix: 'cache'
}
```

After that you can register your plugin in your bootstrap file
```
import {getApp, env} from '@kookjs/core'
const app = getApp({
  root: __dirname
})
import CacheManager from '@kookjs/cache-manager'
app.registerPlugin(CacheManager)
```

### Usage
By default CacheManager returns the MemoryEngine so you can use it like this
```
const cache = app.getPlugin(CacheManager).default
await cache.set('name', 'kook')
await cache.get('name', 'defaultValue')
```

### Using Cache RDBMS

* Install the plugin **@khanakiajs/cache-rdbms** 
* Create a config see above
* Register the entity in your typeorm entities[].
```
import { CacheStore } from '@khanakiajs/cache-rdbms'

// TypeOrm Connection Option (https://typeorm.io/#/connection-options/connection-options-example)
 {
  ....
  entities: [CacheStore]
}

after that you can get the cache instance
const cache = app.getPlugin(CacheManager).store('database')

```
