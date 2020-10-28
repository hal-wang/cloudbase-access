import { existsSync } from "fs";

import BaseAction from "./BaseAction";
import HttpResult from "./HttpResult";

export default class Router {
  readonly auth: Function;

  readonly headers: Object;
  readonly path: String;
  readonly params: Object;
  readonly data: any;

  constructor(readonly event: any, auth?: Function) {
    this.auth = auth ? auth.bind(this) : undefined;

    this.headers = this.event.headers;
    this.path = this.event.path;
    this.params = this.event.queryStringParameters;
    this.data = this.bodyData;
  }

  private routerAction: BaseAction;
  private async initModule() {
    if (this.routerAction) return;

    if (!existsSync(this.getFullPath())) {
      this.routerAction = null;
      return;
    }

    const actionClass = require(this.getFullPath()).default;
    this.routerAction = new actionClass(this.requestParams) as BaseAction;
  }

  async do() {
    await this.initModule();
    if (!this.routerAction)
      return HttpResult.notFound("Can't find a path：" + this.path);

    try {
      if (this.auth && !(await this.auth())) {
        return HttpResult.forbidden();
      }

      return await this.routerAction.do();
    } catch (err) {
      return HttpResult.errRequest(err.message);
    }
  }

  private getFullPath() {
    return `${process.cwd()}/controllers${this.path}.js`;
  }

  get requestParams() {
    return {
      event: this.event,
      headers: this.headers,
      path: this.path,
      params: this.params,
      data: this.data,
    };
  }

  private get bodyData() {
    const body = this.event.body;

    let data: any;
    try {
      data = JSON.parse(body);
      if (!data) data = body;
    } catch {
      data = body;
    }
    return data;
  }
}
