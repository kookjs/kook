export interface IPlugin {
  version: string
  boot(): Promise<void>
  setConfig(config: any): any
  getConfig?(config: any): any
}