import { ICacheEngine } from './ICacheEngine'
import ms from 'ms'
import { MemoryEngine } from './MemoryEngine'
export interface IConfig {
  engine?: ICacheEngine
}

export class Cache {
  protected config : IConfig
  protected engine : ICacheEngine

  constructor(config?: IConfig) {
    this.config = config||{}

    this.engine = this.config.engine||new MemoryEngine()
  }

  setEngine(engine: ICacheEngine) {
    this.engine = engine
  }

  async get(key: string, defaultVal?: any) {
    const value = await this.engine.get(key)
    if(value) return JSON.parse(value)
    return defaultVal
  }

  /*
   * ttl: specify in milisecons 60000 ms = 6 sec
  */
  async set(key: string, value: any, ttl: string='60000') {
    // console.log('set')
    const _ttl = ms(ttl)
    value = JSON.stringify(value)
    return this.engine.set(key, value, _ttl)
    // console.log(ms(ttl)/1000)
  }

  async del(key: string) {
    return this.engine.del(key)
  }

  async reset() {
    return this.engine.reset()
  }
}

export * from './ICacheEngine'
export * from './MemoryEngine'