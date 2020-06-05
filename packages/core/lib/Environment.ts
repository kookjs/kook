const fs = require('fs');
const _ = require('lodash')
const chalk = require("chalk");

export default class Environment {
  
  constructor(private appRoot: string) {
    
  }

  load() {
    const nodeEnv = process.env.NODE_ENV
    const fileName = nodeEnv=='development' ? 'env.js' : `env.${nodeEnv}.js`

    const filePath = `${this.appRoot}/${fileName}`
    // console.log(chalk.gray.underline(prefix), info);
    if(!fs.existsSync(filePath)) {
      return console.warn(chalk.yellow(`Enviornment file does not exists ${filePath}`));
    }
    const variables = require(filePath)
    for (const key in variables) {
      // console.log(variables[key])
      process.env[key] = variables[key]
    }
  }
}

export const env = (name: string, defaultValue?: string) => {
  // console.log(name, process.env[name])
  if(process.env[name]) return process.env[name]
  return defaultValue
}