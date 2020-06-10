import { injectable } from "inversify";

import { getConnection } from "typeorm";
import _ from "lodash";
import chalk from "chalk";

import { Cache } from "@khanakiajs/cache";
import dotObject from "@khanakiajs/dot-object";

import { config } from "@kookjs/core";
import { ConfigOptions, StoreOptions } from "./ConfigOptions";

@injectable()
export default class CacheManager {
	readonly version: string = "1.0";
	readonly config: ConfigOptions;

	public stores: { [key: string]: Cache };
	public default: Cache;

	constructor() {
		this.stores = {};
		this.config = config("cache");
	}

	async boot() {
		this.default = await this.store(this.config.default);
	}

	async store(name: string): Promise<Cache> {
		// check if instance already created return the same
		if (this.stores[name]) return this.stores[name];

		const cacheOptions: StoreOptions = dotObject.getArrayValue(this.config, ["stores", name]);
		if (!cacheOptions) {
			console.log(
				chalk.yellow(`Plugin Cache - Cache Store with name "${name}" not found in config. So by default Cache with Memory will be created.`)
			);
			return this.createCache({
				driver: "memory",
			});
		}

		this.stores[name] = await this.createCache(cacheOptions);

		return this.stores[name];
	}

	async createCache(store: StoreOptions): Promise<Cache> {
		switch (store.driver) {
			case "memory":
				return new Cache({
					prefix: this.config.prefix
				});
				break;
			case "database":
				const CacheRdbms = (await import("@khanakiajs/cache-rdbms")).default;
				return new Cache({
					store: new CacheRdbms(getConnection(store.connectionName)),
					prefix: this.config.prefix
				});
				break;
			default:
				return this.default;
				break;
		}
	}
}

export { ConfigOptions, StoreOptions } from "./ConfigOptions";