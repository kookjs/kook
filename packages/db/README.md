## Typeorm Database plugin for kookjs

### HOW TO USE
Create a new config file in config/db.ts and you can register your connnections like below
```
// import { env } from '@kookjs/core'
const { env } = require('@kookjs/core')
module.exports = {
  'connections' : [
    {
      name: "default",
      type: "postgres",
      host: 'localhost',
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "kookdb",
      synchronize: true,
      logging: false,
      entities: [],
      connect: true
    },
    {
      name: "mysql",
      type: "mysql",
      host: 'localhost',
      port: 3306,
      username: "root",
      password: "root",
      database: "kookjs",
      synchronize: false,
      logging: true,
      entities: [],
      connect: true,
      "extra": { connectionLimit: 1 }
    }
  ]
}
```

After that you can register your plugin in your bootstrap file
```
import DB from '@kookjs/db'
app.registerPlugin(DB)
```