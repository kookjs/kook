export declare type MaybePromise<T> = Promise<T> | T;

export interface ICacheEngine {
 get: (key: string) => Promise<any>
 set: (key: string, val: any, ttl: number) => Promise<Boolean>
 del: (key: string) => Promise<void>
 reset: () => Promise<void>
}