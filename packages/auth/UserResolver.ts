import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware, Authorized } from "type-graphql";
import bcrypt from "bcryptjs";
import { nanoid } from 'nanoid'

import Cache from '@kookjs/cache'
// import  ObjectScalarType from '@kookjs/core/gql/types/ObjectScalarType'
import { MyContext } from "./MyContext";
import { User } from "./entity/User";
import { RegisterInput } from "./register/RegisterInput";
// import { isAuth } from "../middleware/isAuth";
// import { logger } from "../middleware/logger";
// import { sendEmail } from "../utils/sendEmail";
// import { createConfirmationUrl } from "../utils/createConfirmationUrl";
import { ChangePasswordInput, PasswordResetInput } from './PasswordInput'
import { getApp } from "@kookjs/core";

import { forgotPasswordPrefix } from './constants'

@Resolver()
export class UserResolver {
  // @UseMiddleware(isAuth, logger)
  // @Query(() => String)
  // async hello() {
  //   return "Hello World!";
  // }

  @Mutation(() => User)
  async register(@Arg("data")
  {
    email,
    fullName,
    password
  }: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      secret: nanoid()
      
    }).save();

    // await sendEmail(email, await createConfirmationUrl(user.id));

    return user;
  }

  @Authorized()
  @Query(() => User, { nullable: true, complexity: 5 })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    // console.log(ctx.user)
    return ctx.user
  }

  @Authorized()
  @Mutation(() => Boolean)
  async changePassword(@Arg("data")
  {
    currentPassword,
    password,
    confirmPassword
  }: ChangePasswordInput , @Ctx() ctx: MyContext): Promise<Boolean> {

    const currentPasswordValid = await bcrypt.compare(currentPassword, ctx.user.password);
    if(!currentPasswordValid) {
      throw new Error('Current password is wrong')
    }

    if(password!==confirmPassword) {
      throw new Error('Password and Confirm password must be same.')
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    ctx.user.password = hashedPassword
    await ctx.user.save() 

    return true;
  }

  @Mutation(() => String)
  async forgotPassword(@Arg("email") email: string): Promise<string> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found.')
    }

    // const token = nanoid();
    const token = '123';
    const cm = getApp().getPlugin(Cache)
    cm.default.put(`${forgotPasswordPrefix}${token}`, user.id, '1d') // 1 day expiration
  
    // await sendEmail(
    //   email,
    //   `http://localhost:3000/user/change-password/${token}`
    // );

    return token;
  }

  @Mutation(() => String)
  async passwordReset(@Arg("data") { token, password }: PasswordResetInput): Promise<string> {

    const cm = getApp().getPlugin(Cache)
    // console.log(cm.default)
    const userId = await cm.default.get(forgotPasswordPrefix + token);

    if (!userId) {
      throw new Error('Token not found.')
    }

    const user = await User.findOne(userId);

    if (!user) {
      throw new Error('User not found1.')
    }

    await cm.default.del(forgotPasswordPrefix + token);

    user.password = await bcrypt.hash(password, 12);

    await user.save();

    // ctx.req.session!.userId = user.id;

    return 'Password reset successfully';
  }
}
