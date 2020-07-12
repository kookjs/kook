import fs from "fs";
import path from "path";
// import Twig from "twig";
const Twig = require('twig')
import { env, config } from '@kookjs/core'
var appRoot = require('app-root-path').path;

Twig.extendFunction("env", function(value, defaultValue) {
	return env(value, defaultValue)
});

Twig.extendFunction("config", function(key, defaultValue) {
	return config(key, defaultValue)
});

var twig = Twig.twig;

interface TemplateCompileOptions {
		/** Specify templates root or base directory path */
		base?: string,
		/** Template file path starting after the base path */
		path: string,
		/** Data Object to be passed to the template */
		context?: any
}

export default class Template {
	constructor() {
		
	}

	/**
	 * @param filePath Full Path of the Template file
	 * @param data Data to pass to the template
	 */
	async load(filePath, data={}): Promise<any> {
		return new Promise((resolve, reject) => {
			var template = twig({
				path: filePath,
				load(template) {
					const output = template.render(data);
					// console.log(output)
					resolve(output)
				},
				error(e) {
					// console.log(e)
					reject(e)
				}
			});
		})
	}


	/**
	 * if first check template on config.path if exists then it will override the default one
	 */
	async compile(args: TemplateCompileOptions) : Promise<any> {
		const config_ = config("mail");

		// default base path 
		const basePath = config_.path || path.join(appRoot, 'resources/views')
		// console.log(basePath)

		// filepath specified as args
		let filePath = path.join(args.base||basePath, args.path )

		// orverride the args.base path with the default base path if file exists
		let filePathOverride = path.join(basePath, args.path )
		if(fs.existsSync(filePathOverride)) filePath = filePathOverride

		console.log(filePath)
		return await this.load(filePath, args.context||{})
	}
}
