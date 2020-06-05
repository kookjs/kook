import { injectable } from "inversify";
import {createConnections } from "typeorm";
import chalk from 'chalk'
import _ from 'lodash'

import dotObject from '@khanakiajs/dot-object'
import { config } from '@kookjs/core'

@injectable()
export default class DB {
  readonly version: string = "1.0";
  readonly config: any

  readonly connectionOptions: any[]
  
  constructor() {
    this.config = config('db')
    let connectionOptions = dotObject.get(this.config, 'connections', [])
    this.connectionOptions = _.filter(connectionOptions, {connect: true});
  }

  async boot() {
    if(this.connectionOptions.length==0) return console.log(chalk.red(`Plugin DB - Cannot start Database. default variable not defined in config.`))
    
    await createConnections(this.connectionOptions)
  }

  addEntity(entity: Function, connectionNames: string[]=['default']) {
    for (const option of this.connectionOptions) {
      console.log(option.name, connectionNames.indexOf(option.name))
      if(!option.entities || connectionNames.indexOf(option.name)==-1) continue
      option.entities = [...option.entities, ...[entity]]
    }
  }
}