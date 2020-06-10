/*
 * Install - npm install mysql --save
 * Run Example - ts-node ./modules/cache-rdbms/examples/example-mysql.ts
*/

import { Cache } from '@khanakiajs/cache'
import RdbmsStore from '@khanakiajs/cache-rdbms'
import {createConnection, Connection, ConnectionOptions} from "typeorm";
import { CacheStore } from '@khanakiajs/cache-rdbms'

import { sleep } from '@khanakiajs/utils'

const configConnection : ConnectionOptions = {
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  password: "root",
  database: "aa",
  synchronize: true,
  logging: false,
  entities: [CacheStore]
}

const main = async () => {
  const connection = await createConnection(configConnection);

  const cache = new Cache({
    store: new RdbmsStore(connection)
  })

  await cache.put('name', 'Hello world !!')
  // await sleep(7000)
  const name = await cache.get('name')
  console.log(name)
  // await cache.del('name')
  // cache.reset()
}

main()