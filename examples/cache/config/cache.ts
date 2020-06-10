import { ConfigOptions } from '@kookjs/cache'
const config: ConfigOptions = {
  'default' : 'database',

  'stores' : {
    'memory' : {
      driver: "memory"
    },

    'database': {
      driver: "database",
      connectionName: 'default'
    },

  },

  prefix: 'cache:'
}
export default config