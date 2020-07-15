import { InputType, Field } from "type-graphql";

@InputType()
export class UserCapToRoleAddInput {
  @Field()
  roleKey: string;

  @Field(type => [String], { nullable: true })
  capKeys: string[];

  @Field(type => [String], { nullable: true })
  denyCapKeys: string[];
}