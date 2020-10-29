import { existsSync } from "fs";
import Authority from "./Authority";

import BaseAction from "./BaseAction";
import HttpResult from "./HttpResult";
import Middleware from "./Middleware";
import RequestParams from "./RequestParams";

export default class Router {
  private routerAction: BaseAction;

  readonly requestParams: RequestParams;
  readonly middlewares: Array<Middleware> = new Array<Middleware>();

  constructor(
    event: any,
    auth?: Authority,
    public readonly cFolder = "controllers"
  ) {
    this.requestParams = new RequestParams(event);

    if (auth) this.middlewares.push(auth);
  }

  private async initModule() {
    if (this.routerAction) return;
    console.log("fullPath", this.fullPath);

    if (!existsSync(this.fullPath)) {
      this.routerAction = null;
      return;
    }

    const actionClass = require(this.fullPath).default;
    this.routerAction = new actionClass(this.requestParams) as BaseAction;
  }

  public get fullPath() {
    return `${process.cwd()}/${this.cFolder}${this.requestParams.path}.ts`;
  }

  async do() {
    await this.initModule();
    if (!this.routerAction)
      return HttpResult.notFound(
        "Can't find the path：" + this.requestParams.path
      );

    for (let i = 0; i < this.middlewares.length; i++) {
      const mdwResult = await this.middlewares[i].do();
      if (mdwResult) return mdwResult;
    }

    try {
      return await this.routerAction.do();
    } catch (err) {
      return HttpResult.errRequest(err.message);
    }
  }
}
