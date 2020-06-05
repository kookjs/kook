import "reflect-metadata";
import App from './App'

import Hook from '@kookjs/hook'
import { IAppConfig } from './interface/IAppConfig'
import {IPlugin} from './interface/IPlugin'

import { getGlobalVariable } from './utils'


/*
 Create new App from App constructor
*/
function createApp(config?: IAppConfig) : App {
 const app = new App(config);
 app.registerPlugin(Hook)
 return app
}

/*
 Create new App and to the globalScope if not exists otherwise
 get existing app from globalScope 
*/
export function getApp(config?: IAppConfig): App {
  const globalScope = getGlobalVariable();
  if (!globalScope.App)
      globalScope.App = createApp(config);

  return globalScope.App;
}

/*
 get Plugin Instance from App globalScope
*/
// export function getPlugin<T extends IPlugin>(c: new (...args:any) => T) : T {
export function getPlugin<T>(c: new (...args:any) => T) : T {
  const app = getApp()
  return app.getPlugin(c)
}

export const config = (key: string, defaultValue?:string) : any => {
  const app = getApp()
  return (true && app.configManager.config[key]) || defaultValue
}

/*
 exports classes and other functions
*/
export { IAppConfig } from './interface/IAppConfig'
export {IPlugin} from './interface/IPlugin'
export {env} from './lib/Environment'
export * as App from './App'