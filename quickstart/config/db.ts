// import { env } from '@kookjs/core'
import { CacheStore } from '@khanakiajs/cache-rdbms'

module.exports = {
  'connections' : [
    {
      name: "default",
      type: "postgres",
      host: '127.0.0.1',
      port: 5432,
      username: "postgres",
      password: "root",
      database: "kookdb",
      synchronize: true,
      logging: false,
      entities: [CacheStore],
      connect: true
    },
    // {
    //   name: "mysql",
    //   type: "mysql",
    //   host: 'localhost',
    //   port: 3306,
    //   username: "root",
    //   password: "root",
    //   database: "kookdb",
    //   synchronize: false,
    //   logging: true,
    //   entities: [],
    //   connect: true,
    //   "extra": { connectionLimit: 1 }
    // }
  ]
}