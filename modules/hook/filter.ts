import _ from 'lodash'

// type IActionFn  = <T>(args: T) => T;
type IActionFn  = (args: any) => any;

interface IAction {
  tag: string;
  func: IActionFn;
  priority: number;
}

export default class Filter {
  protected actions: IAction[]
  
  constructor() {
    this.actions = []
  }

  add(tag: string, func: IActionFn, priority: number = 10) : void {
    const action: IAction = {
      tag,
      func,
      priority
    }

    this.actions.push(action)
  }

  async apply<T>(tag: string, args: T) : Promise<T> {
    let actions: IAction[] = _.filter(this.actions, function(o: IAction) { return o.tag==tag; });
    actions = _.sortBy(actions, ['priority']);
    // console.log(actions)
    let result : T = args
    for (let index = 0; index < actions.length; index++) {
      let action : IAction = actions[index]
      
      const cloned  = _.cloneDeep(args)
      result = await action.func(cloned)
    }

    return result
  }

  /*
   * Sometimes you need to override the variable itself without cloning because cloning creates a copy of variable
   * Let say you want to use the filter in express js middleware req and want to add or modify the value in request then that value will not pass to the next middleware as it cloned the context so we want to pass the same object to the next middleware so the next middleware can have the same req object along the context chain.
  */
  async applyRaw<T>(tag: string, args: T) : Promise<T> {
    let actions: IAction[] = _.filter(this.actions, function(o: IAction) { return o.tag==tag; });
    actions = _.sortBy(actions, ['priority']);
    // console.log(actions)
    let result : T = args
    for (let index = 0; index < actions.length; index++) {
      let action : IAction = actions[index]
      
      // const cloned  = _.cloneDeep(args)
      result = await action.func(args)
    }

    return result
  }

  remove(tag: string) {
    _.remove(this.actions, function(e) {
        return e.tag == tag;
    });     
  }

  listAll() : IAction[] {
    return this.actions
  }
}