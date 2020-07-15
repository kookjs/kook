import { InputType, Field } from "type-graphql";

@InputType()
export class UserRoleAddInput {
  @Field()
  key: string;

  @Field({ nullable: true })
  title: string;
}

@InputType()
export class UserRoleEditInput {
  // @Field()
  // id: number;

  @Field()
  key: string;

  @Field({ nullable: true })
  title: string;
}