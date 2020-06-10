import { Store } from './Store'
import LRU  from 'lru-cache'

/*
 * Ref: https://github.com/isaacs/node-lru-cache#readme
 * Check LRU cache doc for the options
*/
export class MemoryStore implements Store {
  protected cache : LRU<any, any>

  constructor(options?: any) {
    this.cache = new LRU(options)
  }

  async get(key: string) {
    return this.cache.get(key)
  }

  /*
    * LRU accpet ttl in ms
  */
  async put(key: string, val: any, ttl: number) {
    return this.cache.set(key, val, ttl*1000)
  }

  async del(key: string) : Promise<Boolean> {
    this.cache.del(key)
    return true
  }

  async flush() : Promise<Boolean> {
    this.cache.reset()
    return true
  }
}