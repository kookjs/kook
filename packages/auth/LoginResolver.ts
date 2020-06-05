import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "./entity/User";
import { MyContext } from "./MyContext";

const jwtKey = "my_secret_key"
const jwtExpirySeconds = 30000
import { getApp } from '@kookjs/core'
import { getSignature } from './utils'
@Resolver()
export class LoginResolver {
  @Mutation(() => String, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<any | null> {

    
    const user = await User.findOne({ where: { email } });
    

    if (!user) {
      return 'User not found';
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return 'Wrong password.';
    }

    // var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    // console.log(token)

    const signature = getSignature(user)

    const token = jwt.sign({ email: user.email, id: user.id }, signature, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds,
    })
    console.log("token:", token)
  
    // set the cookie as the token string, with a similar max age as the token
    // here, the max age is in milliseconds, so we multiply by 1000
    // console.log(ctx.res)
    ctx.res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
    
    // ctx.res.end()

    return token

    // if (!user.confirmed) {
    //   return null;
    // }

    // ctx.req.session!.userId = user.id;

    // return user;
  }
}
