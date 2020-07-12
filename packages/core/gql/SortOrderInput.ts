import { InputType, Field, registerEnumType } from "type-graphql";
import { SortDirection } from './SortDirection'

@InputType()
export class SortOrderInput {
  @Field({nullable: true})
  key: string;

  @Field(type => SortDirection, { defaultValue: SortDirection.ASC })
  value: SortDirection;
}