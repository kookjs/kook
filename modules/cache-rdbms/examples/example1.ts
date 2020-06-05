/*
 * Run Example - ts-node ./modules/cache-rdbms/examples/example1.ts
*/

import { Cache } from '@khanakiajs/cache'
import PgEngine from '..'
import {createConnection, Connection, ConnectionOptions} from "typeorm";
import { CacheStore } from '@khanakiajs/cache-rdbms'

import { sleep } from '@khanakiajs/utils'

const configConnection : ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  database: "jeoga",
  synchronize: true,
  logging: false,
  entities: [CacheStore]
}

const main = async () => {
  const connection = await createConnection(configConnection);

  const cache = new Cache({
    engine: new PgEngine(connection)
  })

  await cache.set('name', 'Hello world !!', '4')
  await sleep(7000)
  const name = await cache.get('name')
  console.log(name)
  // await cache.del('name')
  // cache.reset()
}

main()