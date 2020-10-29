import { existsSync } from "fs";

import BaseAction from "./BaseAction";
import HttpResult from "./HttpResult";
import RequestParams from "./RequestParams";

export default class Router {
  private routerAction: BaseAction;

  readonly auth: Function;
  readonly requestParams: RequestParams;

  constructor(readonly event: any, auth?: Function) {
    this.auth = auth ? auth.bind(this) : undefined;
    this.requestParams = new RequestParams(event);
  }

  private async initModule() {
    if (this.routerAction) return;

    if (!existsSync(this.requestParams.fullPath)) {
      this.routerAction = null;
      return;
    }

    const actionClass = require(this.requestParams.fullPath).default;
    this.routerAction = new actionClass(this.requestParams) as BaseAction;
  }

  async do() {
    await this.initModule();
    if (!this.routerAction)
      return HttpResult.notFound(
        "Can't find the path：" + this.requestParams.path
      );

    try {
      if (this.auth && !(await this.auth())) {
        return HttpResult.forbidden();
      }

      return await this.routerAction.do();
    } catch (err) {
      return HttpResult.errRequest(err.message);
    }
  }
}
