import { injectable, inject } from "inversify";

import { getApp } from '@kookjs/core'
// import {IPlugin} from '@kookjs/core'

import DB from '@kookjs/db'
// import Server from '@kookjs/server'
import ServerExpressGql from '@kookjs/server-express-gql'

import OptionEntity from './entity/Option'
import OptionResolver from "./OptionResolver"; // add this

@injectable()
export default class Option {
  readonly version: string = "1.0";
  // private _server: Server
  // private orm: DB

  constructor(@inject('DB') db: DB) {
    // console.log(db)
    // this._server = server
    // this.db = db

    db.addEntity(OptionEntity, ['default'])

    const app = getApp()
    // const server = app.getPlugin(Server)
    
    // server.addRoute({
    //   method: 'get',
    //   url: '/options',
    //   handler: (req, res) => {
    //     res.send('Options')
    //   }
    // })

    const serverExpressGql = app.getPlugin(ServerExpressGql)
    serverExpressGql.addResolver(OptionResolver)
  }

}