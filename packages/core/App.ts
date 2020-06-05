import { Container } from "inversify";
const chalk = require('chalk');
const _ = require('lodash')

import { IPlugin } from './interface/IPlugin'
import { IAppConfig } from './interface/IAppConfig'
import ConfigManager, {getConfigManager} from './lib/ConfigManager'
import Environment from './lib/Environment'
import _config from './config'

interface Dictionary<T> {
  [key: string]: T;
}

export default class App {
  public container: Container
  public configManager: ConfigManager
  private plugins: Dictionary<any>
  readonly config: IAppConfig

  constructor(config?: IAppConfig) {
    this.config =  _.merge(_config, config)

    this.container = new Container()

    // Load env.js file to node enviornment first
    const environment = new Environment(this.config.root)
    environment.load()

    // this.configManager = new ConfigManager(this.config.root)
    this.configManager = getConfigManager(this.config.root)
    this.configManager.loadConfigs()

    this.plugins= {}

  }

  /*
   Add the plugin to the App Container
  */
  // async registerPlugin(Plugin: new (...args:any) => IPlugin) {
  async registerPlugin<T>(Plugin: new (...args:any) => T) {
    const key = Plugin.name
    try {
      this.container.bind(key).to(Plugin).inSingletonScope();
      // const p = this.container.get<IPlugin>(key)
      const p = this.container.get<T>(key)
      // const config = this.configManager.get(key)
      // p.setConfig(config)
      this.plugins[key] = p
      
    } catch (error) {
      console.log(error)
      console.log(chalk.red(`Register Plugin: ${key} - ${error.message}`));
    }
  }

  /*
   * Execute the boot function declared in all the plugins after instantiate plugin class
   * NOTE: run app.boot() at the end of your bootstrap file
  */
  async boot() {
    for (const key of Object.keys(this.plugins)) {      
      const plugin = this.plugins[key]
      // type PluginType = InstanceType<typeof plugin>
      if(!plugin.boot || typeof plugin.boot!=='function') continue
      await plugin.boot()
    }  
  }

  /*
   Get the plugin from existing App container
  */
  // getPlugin<T extends IPlugin>(c: new (...args:any) => T) : T {
  getPlugin<T>(c: new (...args:any) => T) : T {
    return <T>this.plugins[c.name]
  }
}