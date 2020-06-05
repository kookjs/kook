/*
 * Run Example - ts-node ./modules/cache/examples/example1.ts
*/

import {Cache, MemoryEngine } from '@khanakiajs/cache'

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