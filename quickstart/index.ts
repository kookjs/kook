import {getApp, env} from '@kookjs/core'

const app = getApp({
  root: __dirname
})

import DB from '@kookjs/db'
// import Server from '@kookjs/server'
// import ServerExpress from '@kookjs/server-express'
// import ServerExpressGql from '@kookjs/server-express-gql'
// import Option from '@kookjs/option'
// import Auth from '@kookjs/auth'
import CacheManager from '@kookjs/cache-manager'


app.registerPlugin(DB)
// app.registerPlugin(Server)
// app.registerPlugin(ServerExpress)
// app.registerPlugin(ServerExpressGql)
// app.registerPlugin(Option)
// app.registerPlugin(Auth)
app.registerPlugin(CacheManager)


const main = async () => {
  await app.boot()
  console.log('App started.')
  // console.log(env('DB_CONNECTION'))

  const cm = app.getPlugin(CacheManager)
  
  // await cm.store('database')
  // await cm.store('memory')
  // await cm.default.set('name', 'ram')
  // console.log(await cm.default.get('name'))
  // console.log(cm.default)
  // await cm.store('database')
  // console.log(await cm.store('database'))
  // const CacheRdbms = require('@khanakiajs/cache-rdbms')
  // const CacheRdbms = await (await import('@khanakiajs/cache-rdbms')).default
  // console.log(CacheRdbms)
  
}
main();
