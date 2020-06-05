type methods = 'get' | 'post'
export interface IRoute {
  method: methods;
  url: string;
  middlewares?: [],
  handler: (req: any, res: any) => any
}


// export interface Response {
//   status: string
//   statusCode: number
//   protocol: string
//   headers: Map<string, string>
//   body: string
// }

// export interface Request {
//   protocol: string
//   method: string
//   url: string
//   headers: Map<string, string>
//   body: string
// }