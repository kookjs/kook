import { registerEnumType } from "type-graphql";

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

registerEnumType(SortDirection, {
  name: "SortDirection", // this one is mandatory
  description: "The basic directions", // this one is optional
});
