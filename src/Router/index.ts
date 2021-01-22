import Authority from "../Authority";
import HttpResult from "../HttpResult";
import Middleware from "../Middleware";
import MiddlewareType from "../Middleware/MiddlewareType";
import RequestParams from "./RequestParams";
import ActionParser from "../Action/ActionParser";

export { RequestParams };

export default class Router {
  readonly requestParams: RequestParams;
  readonly middlewares = <Middleware[]>[];

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

    const actionParser = new ActionParser(this.requestParams, this.cFolder);
    const actionParserResult = actionParser.getParseResult();
    if (actionParserResult.methodNotAllowed) {
      return HttpResult.methodNotAllowedMsg();
    } else if (!actionParserResult.action) {
      return HttpResult.notFoundMsg({
        message: `Can't find the path：${this.requestParams.path}`,
      });
    }

    const action = actionParserResult.action;
    action.requestParams = this.requestParams;
    if (this.auth) {
      this.auth.roles = ([] as string[]).concat(action.roles);
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
}
