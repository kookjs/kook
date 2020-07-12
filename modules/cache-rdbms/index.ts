import { Store } from '@khanakiajs/cache'

import { Connection } from "typeorm";
import {CacheStore} from './entity/CacheStore'

export default class RdbmsStore implements Store {
  constructor(protected connection: Connection) {}

  async get(key: string) {
    try {
      const record = await CacheStore.findOne({ key });
      const epoch = Math.round(new Date().getTime() / 1000) 
      if (record.expiration < epoch) {
        this.del(key)
        return null
      }
			return record.value;
		} catch (e) {
			return null
		}
  }

  async put(key: string, val: any, seconds: number) {
    try {			
			let record = await CacheStore.findOne({ key });
			if (!record) {
        record = new CacheStore()
        record.key = key
      }
      record.value = val;

      // divided by 1000 to convert epoch miliseconds to seconds
      const expiration = parseInt(((Date.now() + (seconds | 60) * 1000 ) / 1000).toFixed(0))
      // console.log(new Date().toLocaleString());
      // console.log(expiration) 
      // console.log(seconds)
      record.expiration = expiration

      await record.save();
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
  }

  async del(key: string) : Promise<boolean> {
    try {
      await CacheStore.delete({ key });
      return true
		} catch (e) {
      console.log(e);
      return false
		}
  }

  async flush(): Promise<boolean> {
    try {
      await CacheStore.query('TRUNCATE table "cache_store"'); 
      return true
    } catch (error) {
      return false
    }
  }
}

export { CacheStore } from './entity/CacheStore'