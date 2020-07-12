import { ConfigOptions } from './interface/ConfigOptions'
import appRoot from 'app-root-path'
import path from 'path'

const config: ConfigOptions = {
  root: path.resolve(appRoot.path, 'src'),
  // appSecret: 'HN9W34G2BTZ7JZUAXEUC2'
}

export default config