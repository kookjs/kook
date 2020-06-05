import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware, Authorized } from "type-graphql";
import bcrypt from "bcryptjs";
// import { v4 } from "uuid";
import { nanoid } from 'nanoid'


import  ObjectScalarType from '@kookjs/core/gql/types/ObjectScalarType'
import { MyContext } from "./MyContext";
import { User } from "./entity/User";
import { RegisterInput } from "./register/RegisterInput";
// import { isAuth } from "../middleware/isAuth";
// import { logger } from "../middleware/logger";
// import { sendEmail } from "../utils/sendEmail";
// import { createConfirmationUrl } from "../utils/createConfirmationUrl";
import { ChangePasswordInput } from './PasswordInput'

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

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found.')
    }

    const token = nanoid();
    // await redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24); // 1 day expiration

    // await sendEmail(
    //   email,
    //   `http://localhost:3000/user/change-password/${token}`
    // );

    return true;
  }
}
