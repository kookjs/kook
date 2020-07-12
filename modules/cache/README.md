<p align="center">
  <a href="https://kook.khanakia.com/" target="blank"><img src="https://avatars2.githubusercontent.com/u/66347265?s=400&u=b1b91a259fdc55c20a14b18b144ca6af4ed33931&v=4" width="70" alt="Kook Js Logo" /></a>
</p>


[![Node.js CI](https://github.com/node-cache/node-cache/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/node-cache/node-cache/actions?query=workflow%3A%22Node.js+CI%22+branch%3A%22master%22)
![Dependency status](https://img.shields.io/david/node-cache/node-cache)


Small and efficient cache provider for Node.JS written in [Typescript](https://www.typescriptlang.org/) with In-memory, Postgres, Mysql, MS Sql, Sqlite.

### Options

- `store`: *(default: `new MemoryStore()`)* Specify the store for cache new MemoryStore() || [new RdbmsStore()](https://github.com/kookjs/kook/tree/master/modules/cache-rdbms)
- `prefix`: (string) *(default: `kcache`)* When utilizing a RAM based store such as APC or Memcached, there might be other applications utilizing the same cache. So, we'll specify a value to get prefixed to all our keys so we can avoid collisions.

Check examples directory [examples](https://github.com/kookjs/kook/tree/master/modules/cache/examples)

```
// example1.ts
import { Cache, MemoryStore } from '@khanakiajs/cache'

const main = async () => {
  const cache = new Cache({
    store: new MemoryStore()
  })

  await cache.put('name', 'Hello world !!')
  const name = await cache.get('name')
  console.log(name)
  await cache.del('name')
  cache.flush()
}

main()

// Run - ts-node example1.ts
```

## Plugins

|Name|Description|
|:--|:--|
|[**cache-rdmbs**](https://github.com/kookjs/kook/tree/master/modules/cache-rdbms)|Database store plugin for cache supports postgres, mysql, mssql, sqllite|

## API
## put
Store the item in cache store

```js
await cache.put('name', 'Hello world !!')
```

## get
Get the item value from cache store

```js
await cache.get('name')
```

## del
Deleted the item in cache store

```js
await cache.del('name')
```

## flush
Fired when the cache has been flushed.

```js
await cache.flush()
```


## Contribute

If you would like to contribute to the project, please fork it and send us a pull request.  Please add tests
for any new features or bug fixes.

## Stay in touch

* Author - [Aman Khanakia](https://twitter.com/mrkhanakia)
* Website - [https://khanakia.com](https://khanakia.com/)

## License

[MIT licensed](LICENSE).