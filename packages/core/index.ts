import "reflect-metadata";
import { App } from "./App";
import _ from "lodash";
import appRoot from "app-root-path";

import Hook from "@khanakiajs/hook";
import { ConfigOptions } from "./interface/ConfigOptions";
import configDefault from "./config";
import { getGlobalVariable } from "@khanakiajs/util";

/*
 Create new App from App constructor
*/
function _createApp(options?: ConfigOptions): App {
	const config = _.merge(configDefault, options);

	/**
	 * This will only override the root path and set it to the app-root-path module
	 * App.ts has nothing to with the root this is just to override the root
	 */
	if (config.root) appRoot.setPath(config.root);
	
	const app = new App();
	app.registerPlugin(Hook);
	return app;
}

/*
 Create new App and to the globalScope if not exists otherwise
 get existing app from globalScope 
*/
export function createApp(config?: ConfigOptions): App {
	const globalScope = getGlobalVariable();
	if (!globalScope.App) globalScope.App = _createApp(config);

	return globalScope.App;
}

export function getApp(config?: ConfigOptions): App {
	const globalScope = getGlobalVariable();
	return globalScope.App;
}

/*
 get Plugin Instance from App globalScope
*/
export function getPlugin<T>(c: new (...args: any) => T): T {
	const app = getApp();
	return app.getPlugin(c);
}

/*
 exports classes and other functions
*/
export { ConfigOptions } from "./interface/ConfigOptions";
export { env } from "./lib/Environment";
export { config } from "./lib/ConfigManager";
export { App } from "./App";