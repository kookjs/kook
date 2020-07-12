import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { ForbiddenError } from 'apollo-server-express'

import { config } from "@kookjs/core";
import { User } from "../entity/User";
import { MyContext } from "../MyContext";
import { getSignature } from "../utils";
import { LoginInput } from './LoginInput'

@Resolver()
export class LoginResolver {
	@Mutation(() => String, { nullable: true })
	async authLogin(@Arg("args") args: LoginInput, @Ctx() ctx: MyContext): Promise<any | Error> {
		
		const user = await User.findOne({ where: { email: args.username } });

		if (!user) {
			return new ForbiddenError('User not found.');
		}

		const valid = await bcrypt.compare(args.password, user.password);

		if (!valid) {
			throw new ForbiddenError("Wrong password");
		}

    const signature = getSignature(user);
    const jwtExpirySeconds = config('auth.jwtExpirySeconds', 3000)

		const token = jwt.sign({ email: user.email, id: user.id }, signature, {
			algorithm: "HS256",
			expiresIn: jwtExpirySeconds,
		});
		// console.log("token:", token);

		// set the cookie as the token string, with a similar max age as the token
		// here, the max age is in milliseconds, so we multiply by 1000
		// console.log(ctx.res)
		ctx.res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });


		return token;
	}
}
