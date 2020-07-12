import { Field, ObjectType } from "type-graphql";
import { SortDirection } from './SortDirection'

@ObjectType()
export class SortOrderOutput {
  @Field({nullable: true})
  key: string;

  @Field(type => SortDirection, { defaultValue: SortDirection.ASC })
  value: SortDirection;
}