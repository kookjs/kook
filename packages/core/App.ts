import { Container } from "inversify";
import chalk from "chalk";
import _ from "lodash";
// import appRoot from "app-root-path";

import { interopDefault } from '@khanakiajs/util'

// import configDefault from "./config";
import { ConfigOptions } from "./interface/ConfigOptions";
import { DictionaryStrict } from './common/DictionaryStrict'

export class App {
	public container: Container;
	private plugins: DictionaryStrict<any>;
	readonly config: ConfigOptions;

	constructor() {
		// this.config = _.merge(configDefault, config);
		// this.config = config
		this.container = new Container();
		this.plugins = {};
	}

	/*
   Add the plugin to the App Container
  */
	registerPlugin<T>(Plugin: new (...args: any) => T) {
		const key = Plugin.name;
		try {
			this.container.bind(key).to(Plugin).inSingletonScope();
			const p = this.container.get<T>(key);
			this.plugins[key] = p;
		} catch (error) {
			console.log(error);
			console.log(chalk.red(`Register Plugin: ${key} - ${error.message}`));
		}
	}

	/**
	 * Register plugins by specifying the array of plugin paths
	 * @param plugins Object [key: path ]
	 */
	registerPlugins(plugins: string[]) {
		for (const path of plugins) {
			const plugin = interopDefault(require(path))
			this.registerPlugin(plugin)
		}
	}

	/*
	 * Execute the boot function declared in all the plugins after instantiate plugin class
	 * NOTE: run app.boot() at the end of your bootstrap file
	 */
	async boot() {
		for (const key of Object.keys(this.plugins)) {
			const plugin = this.plugins[key];
			if (!plugin.boot || typeof plugin.boot !== "function") continue;
			await plugin.boot();
		}
	}

	/*
   Get the plugin from existing App container
  */
	getPlugin<T>(c: new (...args: any) => T): T {
		return <T>this.plugins[c.name];
	}
}
