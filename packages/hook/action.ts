import _ from 'lodash'

type IActionFn  = (args: any) => any;

interface IAction {
  tag: string;
  func: IActionFn;
  priority: number;
}

export default class Action {
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

  async do(tag: string, args: any) {
    let actions: IAction[] = _.filter(this.actions, function(o: IAction) { return o.tag==tag; });
    actions = _.sortBy(actions, ['priority']);
    // console.log(actions)
    for (let index = 0; index < actions.length; index++) {
      let action : IAction = actions[index]
      await action.func({...args})
    }
  }

  remove(tag: string) {
    _.remove(this.actions, function(e) {
        return e.tag == tag;
    });     
  }
}