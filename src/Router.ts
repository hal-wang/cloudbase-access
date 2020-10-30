import { existsSync } from "fs";
import Authority from "./Authority";
import Action from "./Action";
import HttpResult from "./HttpResult";
import Middleware, { MiddlewareType } from "./Middleware";
import RequestParams from "./RequestParams";

export default class Router {
  private routerAction: Action;
  private readonly middlewares: Array<Middleware> = new Array<Middleware>();

  readonly requestParams: RequestParams;

  constructor(
    event: Record<string, unknown>,
    private readonly auth: Authority = null,
    public readonly cFolder = "controllers"
  ) {
    this.requestParams = new RequestParams(event);

    if (auth != null) this.middlewares.push(auth);
  }

  async configure(mdw: Middleware): Promise<void> {
    this.middlewares.push(mdw);
  }

  async do(): Promise<HttpResult> {
    try {
      let mdwResult = await this.ExecMdw(MiddlewareType.BeforeStart);
      if (mdwResult) return mdwResult;

      await this.initModule();
      if (!this.routerAction)
        return HttpResult.notFound(
          "Can't find the path：" + this.requestParams.path
        );

      mdwResult = await this.ExecMdw(MiddlewareType.BeforeAction);
      if (mdwResult) return mdwResult;

      const result = await this.routerAction.do();

      if (result.isSuccess) {
        mdwResult = await this.ExecMdw(MiddlewareType.BeforeSuccessEnd);
      } else {
        mdwResult = await this.ExecMdw(MiddlewareType.BeforeErrEnd);
      }
      if (mdwResult) return mdwResult;

      mdwResult = await this.ExecMdw(MiddlewareType.BeforeEnd);
      if (mdwResult) return mdwResult;

      return result;
    } catch (err) {
      return HttpResult.errRequest(err.message);
    }
  }

  private async ExecMdw(type: MiddlewareType) {
    for (let i = 0; i < this.middlewares.length; i++) {
      const middleware = this.middlewares[i];
      if (middleware.type != type) continue;

      middleware.requestParams = this.requestParams;
      const mdwResult = await middleware.do();
      if (mdwResult) return mdwResult;
    }
    return null;
  }

  private async initModule() {
    if (this.routerAction) return;

    let fullPath = this.getFullPath("js");
    if (!existsSync(fullPath)) {
      fullPath = this.getFullPath("ts");
      if (!existsSync(fullPath)) {
        return;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionClass = require(fullPath).default;
    this.routerAction = new actionClass(this.requestParams) as Action;
    this.routerAction.requestParams = this.requestParams;
    this.routerAction.middlewares = this.middlewares.map((val) => val);

    if (this.auth != null) this.auth.roles = this.routerAction.roles;
  }

  private getFullPath(type: string) {
    return `${process.cwd()}/${this.cFolder}${this.requestParams.path}.${type}`;
  }
}
