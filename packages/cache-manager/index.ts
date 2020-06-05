import { injectable } from "inversify";

// import {IPlugin} from '@kookjs/core'
import {getConnection} from "typeorm";

import _ from 'lodash'
import { Cache } from '@khanakiajs/cache'
import { config } from '@kookjs/core'
import dotObject from '@khanakiajs/dot-object'


@injectable()
export default class CacheManager {
  readonly version: string = "1.0";
  readonly config: any

  public stores: {[key: string]: Cache}
  public default : Cache

  constructor() {
    this.stores = {}
    this.config = config('cache')
  }

  async boot() {
    if(this.config.default) {
      // const stores = dotObject.get(this.config, 'stores', [])
      // const store = _.find(stores, {name: this.config.default})
      const storeConfig = this.getStoreConfig(this.config.default)
      this.default = await this.createCache(storeConfig)
    } else {
      this.default = new Cache()
    }
  }

  getStoreConfig(storeName) {
    const stores = dotObject.get(this.config, 'stores', [])
    const store = _.find(stores, {name: this.config.default})
    return store
  }

  async store(name: string): Promise<Cache> {
    // check if instance already created return the same
    if(this.stores[name]) return this.stores[name]

    // find the store config and create new store 
    // const _config = config('cache')
    // const stores = dotObject.get(this.config, 'stores', [])
    // const store = _.find(stores, {name: name})
    const storeConfig = this.getStoreConfig(this.config.default)
    if(storeConfig && storeConfig.name!==this.config.default) {
      this.stores[name] = await this.createCache(storeConfig)
      return this.stores[name]
    }
    // console.log(_config)

    return this.default
  }

  async createCache(store) : Promise<Cache> {
    // console.log(store)
    switch (store.driver) {
      case 'memory':
        return new Cache()
        break;
      
      case 'database':
        const CacheRdbms = (await import('@khanakiajs/cache-rdbms')).default
        return new Cache({
          engine: new CacheRdbms(getConnection(store.connectionName))
        })
        break;
    
      default:
        return this.default
        break;
    }
  }
}