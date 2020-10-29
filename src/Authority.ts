import Middleware from "./Middleware";
import BaseAction from "./BaseAction";

export default abstract class Authority extends Middleware {
  constructor(
    public readonly requestParams: Object,
    public readonly action: BaseAction
  ) {
    super(requestParams);
  }

  public get roles() {
    return this.action.roles;
  }
}
