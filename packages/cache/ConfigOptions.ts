import { ObjectLiteralStrict } from '@kookjs/core/common/ObjectLiteralStrict'

type MemoryOption = {
  driver: "memory";
}

type DatabaseOption = {
  driver: "database";
  connectionName: string;
}

export type StoreOptions = MemoryOption | DatabaseOption

// export interface ObjectLiteral<T> {
//   [key: string]: T;
// }

type StoresOptionObject = ObjectLiteralStrict<StoreOptions>

export interface ConfigOptions {
  default: string,
  prefix: string,
  stores: StoresOptionObject
}