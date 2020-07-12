import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware, Authorized } from "type-graphql";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

import Cache from "@kookjs/cache";
import { getApp, config } from "@kookjs/core";

import { MyContext } from "../MyContext";
import { User } from "../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { ChangePasswordInput, PasswordResetInput } from "./PasswordInput";

import { forgotPasswordPrefix } from "../constants";
import { sendForgotPasswordMail } from "../utils";
import {
	ValidationError,
	ForbiddenError
}  from "apollo-server-express";


@Resolver()
export class UserResolver {
	@Mutation(() => User)
	async authRegister(
		@Arg("args")
		{ email, fullName, password }: RegisterInput
	): Promise<User> {

		const salt = config("app.secret", 12)
		const hashedPassword = await bcrypt.hash(password, salt);
		

		const user = await User.create({
			fullName,
			email,
			password: hashedPassword,
			secret: nanoid(),
		}).save();

		// await sendEmail(email, await createConfirmationUrl(user.id));

		return user;
	}

	@Authorized()
	@Query(() => User, { nullable: true, complexity: 5 })
	async authMe(@Ctx() ctx: MyContext): Promise<User | undefined> {
		// console.log(ctx.user)
		return ctx.user;
	}

	@Authorized()
	@Mutation(() => Boolean)
	async authChangePassword(
		@Arg("args")
		{ currentPassword, password, confirmPassword }: ChangePasswordInput,
		@Ctx() ctx: MyContext
	): Promise<boolean> {
		console.log(config("app.secret", "12"))
		const currentPasswordValid = await bcrypt.compare(currentPassword, ctx.user.password);

		if (!currentPasswordValid) {
			throw new ForbiddenError("Current password is wrong");	
		}

		if (password !== confirmPassword) {
			throw new ForbiddenError("Password and Confirm password must be same.");
		}

		const hashedPassword = await bcrypt.hash(password, config("app.secret", 12));

		ctx.user.password = hashedPassword;
		await ctx.user.save();

		return true;
	}

	@Mutation(() => String)
	async authForgotPassword(@Arg("username") username: string): Promise<string> {
		const user = await User.findOne({ where: { email: username } });

		if (!user) {
			throw new ForbiddenError("User not found.");
		}

		const token = nanoid();
		// const token = '123';
		const cm = getApp().getPlugin(Cache);
		cm.default.put(`${forgotPasswordPrefix}${token}`, user.id, "1d"); // 1 day expiration

		await sendForgotPasswordMail(user, token);

		return "We have sent you an email.";
	}

	@Mutation(() => String)
	async authPasswordReset(@Arg("args") { token, password }: PasswordResetInput): Promise<string> {
		const cm = getApp().getPlugin(Cache);
		// console.log(cm.default)
		const userId = await cm.default.get(forgotPasswordPrefix + token);

		if (!userId) {
			throw new ForbiddenError("Token not found."); 
		}

		const user = await User.findOne(userId);

		if (!user) {
			throw new ForbiddenError("User not found.");
		}

		await cm.default.del(forgotPasswordPrefix + token);

		user.password = await bcrypt.hash(password, config("app.secret", 12));

		await user.save();

		// ctx.req.session!.userId = user.id;

		return "Password reset email sent succ";
	}
}