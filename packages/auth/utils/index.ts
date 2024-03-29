import { User } from "../entity/User";
// import { v4 as uuidv4 } from "uuid";
import { nanoid } from "nanoid";
import { getApp, config } from "@kookjs/core";
import Mail from "@kookjs/mail";

/*
 * This signature is used to create a JWT token
 * Benefits - By adding the user secret with the appsecret it makes the app more secure
 * Let say if appSecret is compromised then stil nobody can generate tokens without user secret
 * If userSecreate compromised it will affect only single user not all the users
 * If user wants to focefully logout for all the applications we simply update his userSecret
 * FUTURE CONSIDERATION - Add jwt to token to the blacklist if users logout
 */
export const getSignature = (user: User): string => {
	if (!user.secret) {
		const secret = nanoid();
		user.secret = secret;
		user.save();
	}

	// const appSecret = getApp().config.appSecret
	const appSecret = config("app.secret", "HAshANDhARYpowL");
	// console.log(appSecret)
	const signature = `${appSecret}:${user.secret}`;
	return signature;
};

export const sendForgotPasswordMail = async (user: User, token: string) => {
	const mail = getApp().getPlugin(Mail);

	const message = await mail.template.compile({
		path: "forgot-password.twig",
		base: __dirname + "/../views/",
		context: {
			user,
			token,
		},
	});

	// console.log(message)
	const mailer = await mail.mailer();
	await mailer.sendMail({
		to: user.email,
		html: message,
	});
};
