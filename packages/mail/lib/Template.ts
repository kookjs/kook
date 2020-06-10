// import Twig from "twig";
const Twig = require('twig')
import fs from "fs";
import path from "path";
var twig = Twig.twig;
import { config } from "@kookjs/core";
var appRoot = require('app-root-path').path;

interface CompileArgs {
		base?: string,
		path: string,
		context?: any
}

export default class Template {
	constructor() {
		// this.dirView = Sapp['Uxm/Email'].config.dirView
	}

	// get(name: string, defaultValue: any = null): any {
	// 	try {
	// 		const config_ = config("mail");
	// 		// console.log(config_)
	// 		const paths = config_.paths||{}
	// 		for (const key in paths) {
	// 			// console.log(path.join(paths[key] , name))
	// 			let data = fs.readFileSync(path.join(paths[key] , name), "utf8");
	// 			// console.log(data)
	// 			return data;
				
	// 		}
	// 	} catch (error) {
	// 		// console.log("Twig File Not found.");
	// 	}
	// 	return defaultValue;
	// }

	// compile(args={}) {
	// 		const config_ = config("mail");
	// 		// console.log(config_)
	// 		const paths = config_.paths||{}

	//     let atts = Object.assign({}, {
	//         template: null,
	// 				data: {},
	// 		}, args)

	// 		// const templateData =  this.get(atts.template)
			
	// 		var template = twig({
	// 			path: 'views/demo3/index.twig',
	// 			async: true,
	// 		});

	// 		return template.render()
	// }

	/**
	 * @param filePath Full Path of the Template file
	 * @param data Data to pass to the template
	 */
	async load(filePath, data={}) {
		return new Promise((resolve, reject) => {
			var template = twig({
				path: filePath,
				load(template) {
					const output = template.render(data);
					// console.log(output)
					resolve(output)
				},
				error(e) {
					reject(e)
					// console.log(e)
				}
			});
		})
	}


	/**
	 * if first check template on config.path if exists then it will override the default one
	 */
	async compile(args: CompileArgs) {
		const config_ = config("mail");
		const basePath = config_.path || path.join(appRoot, 'resources/views')
		// console.log(basePath)
		let filePath = path.join(args.base||basePath, args.path )
		let filePathOverride = path.join(basePath, args.path )
		if(fs.existsSync(filePathOverride)) filePath = filePathOverride

		// console.log(filePath)
		return await this.load(filePath, args.context||{})
	}
}
