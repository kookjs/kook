import { injectable } from "inversify";
import { config } from "@kookjs/core";
import dotObject from "@khanakiajs/dot-object";
import { TestAccount } from "nodemailer";
import chalk from "chalk";

import Transport from "./lib/Transport";
import Template from "./lib/Template";
import { ConfigOptions } from './interface/ConfigOptions'

@injectable()
export default class Mail {
	readonly version: string = "1.0";
	readonly config: ConfigOptions;

	readonly transporters: { [key: string]: Transport };
	// public default: Transport;
	readonly testAccount: TestAccount;
	readonly template: Template = new Template()

	constructor() {
		this.transporters = {};
		this.config = config("mail");
	}
	
	/**
	 * 
	 * @param name string
	 * @returns Transport
	 */
	mailer(name?: string): Transport {
		if(!name) name = this.config.default
		
		if (this.transporters[name]) return this.transporters[name];

		const transportOption = dotObject.getArrayValue(this.config, ["mailers", name]);

		if (!transportOption)  {
			// console.log(chalk.yellow(`Plugin Mail - Transporter with name "${name}" not found in config. So transporter will fallback to the default one.`));
			// return this.createTestTransporter();
			throw new Error(chalk.red(`Plugin Mail - Transporter with name "${name}" not found in config.`))
		}

		this.transporters[name] = new Transport(name, transportOption);

		return this.transporters[name]
	}
	
	createTestTransporter(): Transport {
		const transport = new Transport("test", {
			host: "smtp.ethereal.email",
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: "nk3lq4utqn625ngn@ethereal.email", // generated ethereal user
				pass: "1S7gMtdphaApstMsJ2", // generated ethereal password
			},
		});

		return transport;
	}

	async boot() {
		// this.default = this.mailer(this.config.default);
		// this.testAccount = await nodemailer.createTestAccount();
		// const transportOption = dotObject.getArrayValue(this.config, ["mailers", this.config.default]);
		// if(!transportOption) {
		// 	console.log(chalk.yellow(`Plugin Mail - Default Transporter not found in config. So transporter will fallback to the test transporter.`));
		// 	this.default = this.createTestTransporter();
		// } else {
		// 	this.default = this.mailer(this.config.default);
		// }
	}
}

export { ConfigOptions } from './interface/ConfigOptions'