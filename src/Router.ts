import { existsSync } from "fs";
import Authority from "./Authority";

import BaseAction from "./BaseAction";
import HttpResult from "./HttpResult";
import Middleware from "./Middleware";
import RequestParams from "./RequestParams";

export default class Router {
  private routerAction: BaseAction;
  private readonly middlewares: Array<Middleware> = new Array<Middleware>();

  readonly requestParams: RequestParams;

  constructor(
    event: any,
    private readonly auth: Authority = null,
    public readonly cFolder = "controllers"
  ) {
    this.requestParams = new RequestParams(event);

    if (auth != null) this.middlewares.push(auth);
  }

  async do() {
    await this.initModule();
    if (!this.routerAction)
      return HttpResult.notFound(
        "Can't find the path：" + this.requestParams.path
      );

    if (this.auth != null) this.auth.roles = this.routerAction.roles;

    for (let i = 0; i < this.middlewares.length; i++) {
      this.middlewares[i].requestParams = this.requestParams;
      const mdwResult = await this.middlewares[i].do();
      if (mdwResult) return mdwResult;
    }

    try {
      return await this.routerAction.do();
    } catch (err) {
      return HttpResult.errRequest(err.message);
    }
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

  private get fullPath() {
    return `${process.cwd()}/${this.cFolder}${this.requestParams.path}.ts`;
  }
}
