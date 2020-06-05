import { ICacheEngine } from '@khanakiajs/cache'

import { Connection } from "typeorm";
import {CacheStore} from './entity/CacheStore'

export default class PgEngine implements ICacheEngine {
  constructor(protected connection: Connection) {}

  async get(key: string) {
    try {
      const record = await CacheStore.findOne({ key });
      const epoch = Math.round(new Date().getTime() / 1000) 
      // if (record.expire_at.getTime() < Date.now()) {
      if (record.expiration < epoch) {
      // if (record.expire_at.getTime() < Date.now()) {
        this.del(key)
        return null
      }
			return record.value;
		} catch (e) {
			return null
		}
  }

  async set(key: string, val: any, ttl: number) {
    try {			
			let record = await CacheStore.findOne({ key });
			if (!record) {
        record = new CacheStore()
        record.key = key
      }
      record.value = val;

      // console.log(new Date().toLocaleString());

      // divided by 1000 to convert epoch miliseconds to seconds
      const expiration = parseInt(((Date.now() + (ttl | 60) ) / 1000).toFixed(0))
      console.log(expiration) 
      record.expiration = expiration

      await record.save();
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
  }

  async del(key: string) {
    try {
			await CacheStore.delete({ key });
		} catch (e) {
			console.log(e);
		}
  }

  async reset() {
    await CacheStore.query('TRUNCATE table "cache_store"'); 
  }
}

export { CacheStore } from './entity/CacheStore'