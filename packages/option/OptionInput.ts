import  Option  from "./entity/Option";
import { InputType, Field } from "type-graphql";

@InputType()
export class OptionInput implements Partial<Option> {
  @Field()
  option_name: string;

  @Field({ nullable: true })
  option_value?: string;
}