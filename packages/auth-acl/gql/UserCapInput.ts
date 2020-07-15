import { InputType, Field } from "type-graphql";

@InputType()
export class UserCapAddInput {
  @Field()
  key: string;

  @Field({ nullable: true })
  title: string;

  // @Field()
  // isDefault: Boolean;
}

@InputType()
export class UserCapEditInput {
  @Field()
  id: number;

  @Field()
  key: string;

  @Field({ nullable: true })
  title: string;
}