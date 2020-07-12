import { Store } from "./Store";
import ms from "ms";
import { MemoryStore } from "./MemoryStore";
export interface CacheOptions {
  /** Specify the store for cache new MemoryStore() || new RdbmsStore() */
  /** @type {Store} */
  store?: Store

  /** When utilizing a RAM based store such as APC or Memcached, there might be other applications utilizing the same cache. So, we'll specify a value to get prefixed to all our keys so we can avoid collisions. */ 
  prefix?: any
}

import { isString } from "@khanakiajs/util";

export class Cache {
  protected config: CacheOptions;
  protected store: Store;

  constructor(config?: CacheOptions) {
    this.config = Object.assign({} , {
      prefix: 'kcache:'
    }, config)

    this.store = this.config.store || new MemoryStore();
  }

  /**
     * Retrieve an item from the cache by key.
     *
     * @param  string  $key
     * @return mixed
     */
  async get(key: string, defaultVal?: any) {
    const value = await this.store.get(this.config.prefix+key);
    if (value) return JSON.parse(value);
    return defaultVal;
  }

  /**
   * Store an item in the cache for a given number of seconds.
   *
   * @param  string  $key
   * @param  mixed  $value
   * @param  {int|string}  $seconds - You can specify in numbers e.g. 60 seconds or you can have declarative
   * params as string e.g. 60s | 1d - https://github.com/vercel/ms
   * @return bool
   */
  async put(key: string, value: any, ttl: string | number = 60) {
    // console.log(this.config.prefix)
    let _ttl = ttl;
    if (isString(ttl)) {
      _ttl = ms(ttl) / 1000; // convert to secons
    }
    value = JSON.stringify(value);
    return this.store.put(this.config.prefix+key, value, <number>_ttl);
  }

  /**
   * Remove an item from the cache.
   *
   * @param  string  $key
   * @return bool
   */
  async del(key: string) {
    return this.store.del(this.config.prefix+key);
  }

	/**
	 * Remove all items from the cache.
	 *
	 * @return bool
	 */
  async flush() : Promise<boolean> {
    return this.store.flush();
  }
}

export * from "./Store";
export * from "./MemoryStore";
