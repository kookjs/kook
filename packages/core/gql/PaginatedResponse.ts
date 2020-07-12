import { Field, ObjectType, ClassType } from "type-graphql";
import { MetaOutput } from './MetaOutput'

/**
 * 
 * https://github.com/MichalLytek/type-graphql/blob/master/docs/generic-types.md
 * @param TItemClass 
 */
export function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  
  @ObjectType(`Paginated${TItemClass.name}Response`)
  class PaginatedResponseClass {
    // here we use the runtime argument
    @Field(type => [TItemClass])
    // and here the generic type
    items: TItem[];

    @Field(type => MetaOutput)
    meta: MetaOutput;
  }
  return PaginatedResponseClass;
}