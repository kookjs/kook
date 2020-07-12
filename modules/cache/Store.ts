// export declare type MaybePromise<T> = Promise<T> | T;

export interface Store {
 get: (key: string) => Promise<any>
 put: (key: string, val: any, ttl: number) => Promise<boolean>
 del: (key: string) => Promise<boolean>
 flush: () => Promise<boolean>
}