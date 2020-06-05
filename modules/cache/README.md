Small and efficient cache provider for Node.JS written in Typescript with In-memory, Postgres.

Note: Check examples directory for examples

```
// example1.ts
import { Cache, MemoryEngine } from '@khanakiajs/cache'

const main = async () => {
  const cache = new Cache({
    engine: new MemoryEngine()
  })

  await cache.set('name', 'Hello world !!')
  const name = await cache.get('name')
  console.log(name)
  await cache.del('name')
  cache.reset()
}

main()

// Run - ts-node example1.ts
```
