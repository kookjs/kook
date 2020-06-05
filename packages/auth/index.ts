import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import {IPlugin, getApp} from '@kookjs/core'

import DB from '@kookjs/db'
import Hook from '@kookjs/hook'
import ServerExpressGql from '@kookjs/server-express-gql'


import {User} from './entity/User'
import {UserResolver} from "./UserResolver"; // add this
import {LoginResolver} from "./LoginResolver"; // add this

// import {MyContext} from './MyContext'
import { getSignature } from './utils'

@injectable()
export default class Auth {
  readonly version: string = "1.0.0";
 
  constructor() {

    const app = getApp()
    const db = app.getPlugin(DB)
    db.addEntity(User)

    const serverExpressGql = app.getPlugin(ServerExpressGql)
    serverExpressGql.addResolver(UserResolver)
    serverExpressGql.addResolver(LoginResolver)

    const hook = app.getPlugin(Hook)

    serverExpressGql.filterContext(async (ctx) : Promise<any> => {
      const token = ctx.req.cookies.token || '';
      // console.log(token)
      let args = {}
      let user: User = null
      try {
        
        const decrypt = await jwt.decode(token, {
          verify: false
        });
        // console.log(decrypt)
        if(!decrypt.id) return false

        user = await User.findOne(decrypt.id)
        if(!user) return false

        const signature = getSignature(user)
        const decoded = await jwt.verify(token, signature);
        
          // console.log(user)
        args['user'] = user
        args['jwt'] = decoded
        
      } catch (e) {
        console.log('Error', e.message)        
      }

      return {...ctx,  ...args}
      // return ctx
    })
  }

  async boot() {
    // console.log('Hook boot')
  }

  setConfig() {
    
  }
}