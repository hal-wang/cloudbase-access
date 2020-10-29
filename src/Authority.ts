import Middleware from "./Middleware";
import BaseAction from "./BaseAction";
import { RequestParams } from "..";

export default abstract class Authority extends Middleware {
  constructor(
    public readonly requestParams: RequestParams,
    public readonly action: BaseAction
  ) {
    super(requestParams);
  }

  public get roles() {
    return this.action.roles;
  }
}
