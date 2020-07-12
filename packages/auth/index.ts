import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import { getApp } from "@kookjs/core";

import DB from "@kookjs/db";
import Hook from "@khanakiajs/hook";
import ServerExpressGql from "@kookjs/server-express-gql";

import { User } from "./entity/User";
import { UserResolver } from "./gql/UserResolver"; // add this
import { LoginResolver } from "./gql/LoginResolver"; // add this

// import {MyContext} from './MyContext'
import { getSignature } from "./utils";

@injectable()
export default class Auth {
	readonly version: string = "1.0.0";

	constructor() {
		const app = getApp();
		const db = app.getPlugin(DB);
		db.addEntity(User);

		const serverExpressGql = app.getPlugin(ServerExpressGql);
		serverExpressGql.addResolver(UserResolver);
		serverExpressGql.addResolver(LoginResolver);

		const hook = app.getPlugin(Hook);

		serverExpressGql.filterContext(
			async (ctx): Promise<any> => {
				const token = ctx.req.cookies.token || null;
				if (!token) return ctx;
				
				let args = {};
				let user: User = null;
				try {
					const decrypt = await jwt.decode(token, {
						json: true
          });
                  
					if (!decrypt.id) return false;

					user = await User.findOne(decrypt.id);
					if (!user) return false;

					const signature = getSignature(user);
					const decoded = await jwt.verify(token, signature);

					args["user"] = user;
					args["jwt"] = decoded;
				} catch (e) {
					console.log("Plugin Auth - Error jwt ", e.message);
				}

				return { ...ctx, ...args };
				// return ctx
			}
		);
	}
}


export { ConfigOptions } from './ConfigOptions'