import { injectable } from "inversify";

import {IPlugin} from '@kookjs/core'

import action from './action'
import filter from './filter'

@injectable()
class Hook implements IPlugin {
  readonly version: string = "1.0";
  
  readonly Action: action
  readonly Filter: filter

  constructor() {
    // this.version = "1.0.0"

    this.Action = new action()
    this.Filter = new filter()
  }

  async boot() {
    // console.log('Hook boot')

  }

  setConfig() {
    
  }
}

export default Hook