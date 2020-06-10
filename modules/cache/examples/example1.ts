/*
 * Run Example - ts-node ./modules/cache/examples/example1.ts
*/

import {Cache, MemoryStore } from '@khanakiajs/cache'

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