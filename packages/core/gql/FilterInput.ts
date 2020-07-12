import { InputType, Field, registerEnumType } from "type-graphql";

import { AnyScalarType } from './types/AnyScalarType'

export enum FilterCondition {
  AND = 'and',
  OR = 'or'
}

registerEnumType(FilterCondition, {
  name: "FilterCondition", // this one is mandatory
  description: "The basic FilterCondition", // this one is optional
});


@InputType()
export class FilterInput {
  @Field(type => FilterCondition, {defaultValue: FilterCondition.AND})
  condition: FilterCondition;

  @Field()
  field: string;

  @Field({defaultValue: '='})
  operator: string;

  @Field(type => AnyScalarType, {nullable: true})
  value: any;

  // @Field(type => [FilterInput], {nullable: true})
  // group: [FilterInput];
}