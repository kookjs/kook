import { injectable, inject } from "inversify";
import _ from 'lodash'

import _config , { IConfig } from './config'
import { IRoute } from './interfaces'

@injectable()
export default class Server {
  // private _hook: Hook
  public version: string;

  protected config : IConfig
  protected routes: IRoute[]

  constructor() {
    this.version = "1.0.0"

    // this._hook = hook
    console.log('Server consturctor called')
    // console.log(this._hook.version)

    this.config = _config
    this.routes = []
  }

  async boot() {
    // console.log(this.routes)
  }

  addRoute(route: IRoute): IRoute[] {
    this.routes = [...this.routes, ...[route]]
    return this.routes
  }

  addRoutes(routes: IRoute[]): IRoute[] {
    for (const route of routes) {
      this.addRoute(route)
    }
    return this.routes
  }

  getRoutes(): IRoute[] {
    return this.routes
  }
}