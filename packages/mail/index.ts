import { injectable } from "inversify";
import { config } from "@kookjs/core";
import dotObject from "@khanakiajs/dot-object";
import { TestAccount } from "nodemailer";
import chalk from "chalk";

import Transport from "./lib/Transport";
import Template from "./lib/Template";
import {IConfig} from './interface/IConfig'

@injectable()
export default class MailManager {
	readonly version: string = "1.0";
	readonly config: IConfig;

	readonly transporters: { [key: string]: Transport };
	public default: Transport;
	readonly testAccount: TestAccount;
	readonly template: Template = new Template()

	constructor() {
		this.transporters = {};
		this.config = config("mail");
	}

	mailer(name: string): Transport {
		if (this.transporters[name]) return this.transporters[name];

		const transportOption = dotObject.getArrayValue(this.config, ["mailers", name]);
		// console.log(transportOption)
		if (!transportOption)  {
			console.log(chalk.yellow(`Plugin Mail - Transporter with name "${name}" not found in config. So test transport will be created by default.`));
			return this.createTestTransporter();
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
		// this.testAccount = await nodemailer.createTestAccount();
		this.default = this.mailer(this.config.default);
	}
}

// export * as Template from './lib/Template'

export {IConfig} from './interface/IConfig'