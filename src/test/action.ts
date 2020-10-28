import { BaseAction, HttpResult } from "../../index";

export default class ActionTest extends BaseAction {
  constructor(requestParams: Object) {
    super(requestParams);
  }

  do(): Promise<HttpResult> {
    return this.ok("action");
  }
}
