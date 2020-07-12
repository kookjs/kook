import { injectable } from "inversify";

import { getConnection } from "typeorm";
import _ from "lodash";
import chalk from "chalk";

import { Cache as CacheM } from "@khanakiajs/cache";
import dotObject from "@khanakiajs/dot-object";

import { config } from "@kookjs/core";
import { ConfigOptions, StoreOptions } from "./ConfigOptions";

@injectable()
export default class Cache {
	readonly version: string = "1.0";
	readonly config: ConfigOptions;

	public stores: { [key: string]: CacheM };
	public default: CacheM;

	constructor() {
		this.stores = {};
		this.config = config("cache");
	}

	async boot() {
		this.default = await this.store(this.config.default);
	}

	async store(name?: string): Promise<CacheM> {
		if(!name) name = this.config.default
		
		// check if instance already created return the same
		if (this.stores[name]) return this.stores[name];

		const cacheOptions: StoreOptions = dotObject.getArrayValue(this.config, ["stores", name]);
		if (!cacheOptions) {
			// console.log(
			// 	chalk.yellow(`Plugin Cache - Cache Store with name "${name}" not found in config. So by default Cache with Memory will be created.`)
			// );
			// return this.createCache({
			// 	driver: "memory",
			// });
			throw new Error(chalk.red(`Plugin Cache - Cache Store with name "${name}" not found in config.`))
		}

		this.stores[name] = await this.createCache(cacheOptions);

		return this.stores[name];
	}

	async createCache(store: StoreOptions): Promise<CacheM> {
		switch (store.driver) {
			case "memory":
				return new CacheM({
					prefix: this.config.prefix
				});
				break;
			case "database":
				const CacheRdbms = (await import("@khanakiajs/cache-rdbms")).default;
				return new CacheM({
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