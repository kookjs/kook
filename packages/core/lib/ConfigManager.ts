// const path = require('path');
const fs = require('fs');
const _ = require('lodash')
import { getGlobalVariable } from '../utils'

import path from 'path'
import glob from 'glob'

export default class ConfigManager {
  // public env : string
  private appRoot : string
  readonly config : any

  constructor(appRoot: string) {
    // this.env = process.env.NODE_ENV||'default'
    this.appRoot = appRoot;

    this.config = {}
  }

  // getFilePath(fileName: string, env: string) {
  //   const filePath = `${this.appRoot}/config/${env}/${fileName}.js`
  //   // console.log(filePath)
  //   return filePath
  // }
  
  // getFile(filePath: string) {
  //   if(fs.existsSync(filePath)) {
  //     const c = require(filePath)
  //     return c
  //   }
  //   return null
  // }

  // get(fileName: string) {
  //   const filePathDefault = this.getFilePath(fileName, 'default')
  //   const configDefault = this.getFile(filePathDefault)
    
  //   let configEnv = {}
  //   if(this.env!=='default') {
  //     const filePathEnv = this.getFilePath(fileName, this.env)
  //     configEnv = this.getFile(filePathEnv)
  //   }
    
  //   const config = _.merge(configDefault, configEnv)
  //   return config
  // }

  get(name: string): any {
    if(this.config[name]) return this.config[name]
    let filePath = path.resolve(`${this.appRoot}/config/${name}.ts`)
    if(fs.existsSync(filePath)) {
      this.config[name] = require(filePath)
      return this.config[name]
    }
    return null
  }

  // loadAll() {
  //   const files = glob.sync(path.resolve(`${this.appRoot}/config/*.{ts,js}`))
  //   for (const file of files) {
  //     // console.log(file)
  //     const configName = path.parse(file).name;
  //     // console.log(configName)
  //     this.config[configName] = require(file)
  //   }
  //   // console.log(this.config)
  // }
}



export const getConfigManager = (appRoot: string) : ConfigManager => {
  const globalScope = getGlobalVariable();
  if (!globalScope.AppConfig)
      globalScope.AppConfig  = new ConfigManager(appRoot);
  return globalScope.AppConfig
}

