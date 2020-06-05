const path = require('path');
var appRoot = require('app-root-path').path;
// export interface IAppConfig {
//   appDir?: string
//   appSecret? : string
// }

import { IAppConfig } from './interface/IAppConfig'

// console.log(appRoot)
const config: IAppConfig = {
  root: appRoot,
  appSecret: 'HN9W34G2BTZ7JZUAXEUC2'
}

export default config