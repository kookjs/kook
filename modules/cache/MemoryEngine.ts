import { ICacheEngine } from './ICacheEngine'
import lru from 'lru-cache'

/*
 * Ref: https://github.com/isaacs/node-lru-cache#readme
 * Check LRU cache doc for the options
*/
export class MemoryEngine implements ICacheEngine {
  protected cache : any

  constructor(options?: any) {
    this.cache = new lru(options)
  }

  async get(key: string) {
    return this.cache.get(key)
  }

  async set(key: string, val: any, ttl: number) {
    return this.cache.set(key, val, ttl)
  }

  async del(key: string) {
    return this.cache.del(key)
  }

  async reset() {
    return this.cache.reset()
  }
}