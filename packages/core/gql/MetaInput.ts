import { InputType, Field, registerEnumType, ObjectType, Float } from "type-graphql";

import { SortOrderInput } from './SortOrderInput'

@InputType()
export class MetaInput {
  // @Field({nullable: true})
  // total?: number;

  @Field({ defaultValue: 1 })
  page: number;

  @Field({ defaultValue: 10 })
  limit: number;

  @Field(() => [SortOrderInput], {nullable: true})
  orderBy?: [SortOrderInput];
}
