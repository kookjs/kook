## Cache Manger Plugin for Kook.js

### Usage
Create a new config file in your app root `config/cache.ts`
```
import { ConfigOptions } from '@kookjs/cache'
const config: ConfigOptions = {
  'default' : 'database',

  'stores' : {
    'memory' : {
      driver: "memory"
    },

    'database': {
      driver: "database",
      connectionName: 'default'
    },

  },

  prefix: 'cache:'
}
export default config
```

After that you can register your plugin in your bootstrap file
```
import {createApp, env} from '@kookjs/core'
import Cache from "@kookjs/cache";
const app = createApp({
  root: __dirname
})
app.registerPlugin(Cache)
```

### Usage
By default Cache returns the [MemoryStore](https://github.com/kookjs/kook/tree/master/modules/cache) so you can use it like this. If not store is defined it wil ltake the default store defined in config file.
```
const cache = await app.getPlugin(CacheManager).store()
await cache.put('name', 'kook')
await cache.get('name', 'defaultValue')
```


### Get Different Store
You can get different mailer by using below function. If Mailer does not found any default mailer because of some misconfiguration then it will return the `test mailer` by default.
```
  const cache = await app.getPlugin(CacheManager).store('mystore')
```

### Using Cache RDBMS Store for database postgres, mysql, mssql

* Install the plugin **[@khanakiajs/cache-rdbms](https://github.com/kookjs/kook/tree/master/modules/cache-rdbms)** 
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
const cache = await app.getPlugin(CacheManager).store('database')

```
