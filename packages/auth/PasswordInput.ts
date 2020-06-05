import { Length, MinLength } from "class-validator";
import { Field, InputType, ClassType } from "type-graphql";


export const PasswordMixin = <T extends ClassType>(BaseClass: T) => {
  @InputType()
  class PasswordInput extends BaseClass {
    @Field()
    @MinLength(5)
    password: string;
  }
  return PasswordInput;
};

@InputType()
export class ChangePasswordInput {
  @Field()
  currentPassword: string;

  @Field()
  @MinLength(5)
  password: string;

  @Field()
  @MinLength(5)
  confirmPassword: string;
}
