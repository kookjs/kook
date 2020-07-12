import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";
import { PasswordMixin } from "../PasswordInput";

@InputType()
export class RegisterInput extends PasswordMixin(class {}) {
  @Field()
  @Length(1, 255)
  fullName: string;

  @Field()
  @IsEmail()
  // @IsEmailAlreadyExist({ message: "email already in use" })
  email: string;
}
