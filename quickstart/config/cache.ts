// import { env } from '@kookjs/core'

module.exports = {
  'default' : 'database',

  'stores' : [
    {
      name: "memory",
      driver: "memory",
    },

    {
      name: "database",
      driver: "database",
      connectionName: 'default'
    },
  ],

  prefix: 'cache'
}