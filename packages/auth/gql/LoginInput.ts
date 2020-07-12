import  { User }  from "./entity/User";
import { InputType, Field } from "type-graphql";
import { IsInt } from "class-validator";

@InputType()
export class LoginInput {

  // @IsInt({ message: "email already in use" })
  @Field()
  username: string;

  @Field()
  password: string;
}