import { existsSync, readdirSync } from "fs";
import Authority from "./Authority";
import Action from "./Action";
import HttpResult from "./HttpResult";
import Middleware from "./Middleware";
import MiddlewareType from "./MiddlewareType";
import RequestParams from "./RequestParams";
import linq = require("linq");

export default class Router {
  private readonly middlewares: Array<Middleware> = new Array<Middleware>();

  readonly requestParams: RequestParams;

  constructor(
    event: Record<string, unknown>,
    context: Record<string, unknown>,
    private readonly auth?: Authority,
    public readonly cFolder = "controllers"
  ) {
    this.requestParams = new RequestParams(event, context);

    if (auth != null) this.middlewares.push(auth);
  }

  async configure(mdw: Middleware): Promise<void> {
    this.middlewares.push(mdw);
  }

  async do(): Promise<HttpResult> {
    let mdwResult = await this.ExecMdw(MiddlewareType.BeforeStart);
    if (mdwResult) return mdwResult;

    const action = this.getAction();
    if (!action) {
      return HttpResult.notFound(
        `Can't find the path：${this.requestParams.path}`
      );
    }

    mdwResult = await this.ExecMdw(MiddlewareType.BeforeAction);
    if (mdwResult) return mdwResult;

    const result = await action.do();

    if (result.isSuccess) {
      mdwResult = await this.ExecMdw(MiddlewareType.BeforeSuccessEnd);
    } else {
      mdwResult = await this.ExecMdw(MiddlewareType.BeforeErrEnd);
    }
    if (mdwResult) return mdwResult;

    mdwResult = await this.ExecMdw(MiddlewareType.BeforeEnd);
    if (mdwResult) return mdwResult;

    return result;
  }

  private async ExecMdw(type: MiddlewareType): Promise<HttpResult | null> {
    for (let i = 0; i < this.middlewares.length; i++) {
      const middleware = this.middlewares[i];
      if (middleware.type != type) continue;

      middleware.requestParams = this.requestParams;
      const mdwResult = await middleware.do();
      if (!mdwResult.success) return mdwResult.failedResult;
    }
    return null;
  }

  private getAction(): Action | undefined {
    const path = this.getActionPath();
    if (!path) return;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionClass = require(path).default;
    const action = new actionClass(this.requestParams) as Action;
    action.requestParams = this.requestParams;
    action.middlewares = this.middlewares.map((val) => val);
    if (this.auth) {
      this.auth.roles = ([] as string[]).concat(action.roles);
    }
    return action;
  }

  private getActionPath(): string | undefined {
    if (!this.requestParams.path) return;
    if (this.requestParams.path.includes("..")) return;

    const folderIndex = this.requestParams.path.lastIndexOf("/");
    if (folderIndex < 0 || folderIndex >= this.requestParams.path.length - 1) {
      return;
    }

    const folder = this.requestParams.path.substr(0, folderIndex);
    const folderPath = `${process.cwd()}/${this.cFolder}${folder}`;
    if (!existsSync(folderPath)) return;

    const actionFile = this.requestParams.path.substr(
      folderIndex + 1,
      this.requestParams.path.length - folderIndex - 1
    );
    const files = readdirSync(folderPath);

    const file = linq
      .from(files)
      .where(
        (f) =>
          f.toLowerCase() == actionFile.toLowerCase() + ".js" ||
          f.toLowerCase() == actionFile.toLowerCase() + ".ts"
      )
      .orderByDescending((f) => f)
      .firstOrDefault();
    if (!file) return;

    return `${folderPath}/${file}`;
  }
}
