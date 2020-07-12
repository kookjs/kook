import fs from "fs";
import path from "path";
import _ from "lodash";
import chalk from "chalk";
import appRoot from "app-root-path";
import { getGlobalVariable } from "@khanakiajs/util";

export default class Environment {
	constructor() {}

	/**
	 * get the env.js || env.{NODE_ENV}.js file and process all the variables to the process.env 
	 * This function has to be run only once
	 */
	load() : void {
		const nodeEnv = process.env.NODE_ENV;
		const fileName = ["development", undefined].indexOf(nodeEnv) !== -1 ? "env.js" : `env.${nodeEnv}.js`;

		const filePath = path.join(appRoot.path, fileName);

		if (!fs.existsSync(filePath)) {
			return console.warn(chalk.yellow(`Enviornment file does not exists ${filePath}`));
		}
		const variables = require(filePath);
		for (const key in variables) {
			// console.log(variables[key])
			process.env[key] = variables[key];
		}
	}
}

/**
 * Get Env class from globalScope if not exists then create a new one
 * and then add to the globalScope
 */
export function getEnv(): Environment {
	const globalScope = getGlobalVariable();
	if (!globalScope.AppEnv) {
		globalScope.AppEnv = new Environment();
		globalScope.AppEnv.load();
	}
	return globalScope.AppEnv;
}

/**
 *
 * @param name string - Name of the enviornment variable to get
 * @param defaultValue string - If no value found then return the defaultValue
 */
export const env = (name: string, defaultValue?: string) : any => {
	getEnv();
	if (process.env[name]) return process.env[name];
	return defaultValue;
};
