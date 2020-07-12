import  Option  from "./entity/Option";
import { InputType, Field } from "type-graphql";
import { IsInt } from "class-validator";

@InputType()
export class OptionInput implements Partial<Option> {

  // @IsInt({ message: "email already in use" })
  @Field()
  key: string;

  @Field({ nullable: true })
  value?: string;
}