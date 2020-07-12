import { Field, ObjectType } from "type-graphql";
import { SortOrderOutput } from './SortOrderOutput'

@ObjectType()
export class MetaOutput {
  @Field({nullable: true})
  total?: number;

  @Field({ defaultValue: 0 })
  page: number;

  @Field({ defaultValue: 10 })
  limit: number;

  @Field(() => [SortOrderOutput], {nullable: true})
  orderBy?: [SortOrderOutput];
}