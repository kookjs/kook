import fs from "fs";
import path from "path";
import _ from "lodash";
import appRoot from "app-root-path";
import dotObject from "@khanakiajs/dot-object";
import { getGlobalVariable, interopDefault } from "@khanakiajs/util";

class ConfigManager {
	readonly config: any;

	constructor() {
		this.config = {};
	}

	get(name: string): any {
		if (this.config[name]) return this.config[name];
		let filePath = path.resolve(appRoot.path, 'config', `${name}.ts`);
		if (fs.existsSync(filePath)) {
			const config = require(filePath);
			this.config[name] = interopDefault(config);
			return this.config[name];
		}
		return null;
	}
}

/**
 * Get ConfigManager class from globalScope if not exists then create a new one
 * and then add to the globalScope
 */
const getConfigManager = (): ConfigManager => {
	const globalScope = getGlobalVariable();
	if (!globalScope.AppConfig) globalScope.AppConfig = new ConfigManager();
	return globalScope.AppConfig;
};

/**
 *
 * @param keyPath string - You can pass key like this config('app.appName')
 * @param defaultValue any - If no value is returned then it will use default value
 */
export const config = (keyPath: string, defaultValue: any = null): any => {
	const segments = dotObject.getPathSegments(keyPath);
	const key = segments.shift();
	const config = getConfigManager().get(key);
	const value = dotObject.getArrayValue(config, segments, defaultValue);
	return value;
};
