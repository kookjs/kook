// export declare type MaybePromise<T> = Promise<T> | T;

export interface Store {
 get: (key: string) => Promise<any>
 put: (key: string, val: any, ttl: number) => Promise<Boolean>
 del: (key: string) => Promise<Boolean>
 flush: () => Promise<Boolean>
}