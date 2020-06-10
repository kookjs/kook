/**
 * Interface of the simple literal object with any string keys.
 */
export interface ObjectLiteralStrict<T> {
  [key: string]: T;
}