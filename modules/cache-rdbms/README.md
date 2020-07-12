<p align="center">
  <a href="https://kook.khanakia.com/" target="blank"><img src="https://avatars2.githubusercontent.com/u/66347265?s=400&u=b1b91a259fdc55c20a14b18b144ca6af4ed33931&v=4" width="70" alt="Kook Js Logo" /></a>
</p>


[![Node.js CI](https://github.com/node-cache/node-cache/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/node-cache/node-cache/actions?query=workflow%3A%22Node.js+CI%22+branch%3A%22master%22)
![Dependency status](https://img.shields.io/david/node-cache/node-cache)

### A Database Storage Engine for [@khanakiajs/cache](https://github.com/kookjs/kook/tree/master/modules/cache) with postgres, mysql, mssql, sqllite support


Check examples directory [examples](https://github.com/kookjs/kook/tree/master/modules/cache-rdbms/examples)

```
// example1.ts
import { Cache } from '@khanakiajs/cache'
import RdbmsStore from '@khanakiajs/cache-rdbms'
import {createConnection, Connection, ConnectionOptions} from "typeorm";
import { CacheStore } from '@khanakiajs/cache-pg'

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
    store: new RdbmsStore(connection)
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

## Contribute

If you would like to contribute to the project, please fork it and send us a pull request.  Please add tests
for any new features or bug fixes.

## Stay in touch

* Author - [Aman Khanakia](https://twitter.com/mrkhanakia)
* Website - [https://kook.khanakia.com](https://kook.khanakia.com/)

## License

Cache RDBMS is [MIT licensed](LICENSE).
