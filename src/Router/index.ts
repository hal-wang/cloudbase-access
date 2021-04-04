import Authority from "../Authority";
import HttpResult from "../HttpResult";
import Middleware from "../Middleware";
import MiddlewareType from "../Middleware/MiddlewareType";
import RequestParams from "./RequestParams";
import MapParser from "../Map/MapParser";
import MiddlewareResult from "../Middleware/MiddlewareResult";
import { Action } from "..";

export default class Router {
  private static _current: Router;
  public static get current(): Router {
    return this._current;
  }

  readonly requestParams: RequestParams;
  readonly middlewares = <Middleware[]>[];

  private readonly mdwAdditives = <Record<string, string>>{};

  /**
   * is httpMethod necessary
   *
   * if not, the path end with the httpMethod word will be matched.
   * for example, the post request with path 'user/get' match 'user.ts'.
   *
   * if true, the action in definition must appoint method.
   */
  public isMethodNecessary = false;

  constructor(
    event: Record<string, unknown>,
    context: Record<string, unknown>,
    private readonly auth?: Authority,
    public readonly cFolder = "controllers"
  ) {
    Router._current = this;
    this.requestParams = new RequestParams(event, context);
    if (auth != null) this.middlewares.push(auth);
  }

  async configure(mdw: Middleware): Promise<void> {
    this.middlewares.push(mdw);
  }

  async do(): Promise<HttpResult> {
    let mdwResult = await this.ExecMdw(MiddlewareType.BeforeStart);
    if (!mdwResult.success) {
      return this.getResultWithAdditives(mdwResult.failedResult);
    }

    const actionResult = this.getAction();
    if (!actionResult.success) {
      return this.getResultWithAdditives(
        actionResult.failedResult as HttpResult
      );
    }
    const action = actionResult.action as Action;

    mdwResult = await this.ExecMdw(MiddlewareType.BeforeAction, action);
    if (!mdwResult.success) {
      return this.getResultWithAdditives(mdwResult.failedResult);
    }

    const result = await action.do();

    mdwResult = await this.ExecEndMdw(result, action);
    if (!mdwResult.success) {
      return this.getResultWithAdditives(mdwResult.failedResult);
    }

    return this.getResultWithAdditives(result);
  }

  private getAction(): {
    success: boolean;
    action?: Action;
    failedResult?: HttpResult;
  } {
    let action;
    try {
      const mapParser = new MapParser(
        this.requestParams,
        this.cFolder,
        this.isMethodNecessary
      );
      action = mapParser.action;
    } catch (err) {
      if (err.httpResult) {
        return {
          success: false,
          failedResult: err.httpResult,
        };
      } else {
        throw err;
      }
    }
    if (this.auth) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.auth as any).roles = ([] as string[]).concat(action.roles);
    }
    return {
      success: true,
      action: action,
    };
  }

  private async ExecEndMdw(
    actionResult: HttpResult,
    action?: Action
  ): Promise<MiddlewareResult> {
    let mdwResult;
    if (actionResult.isSuccess) {
      mdwResult = await this.ExecMdw(
        MiddlewareType.BeforeSuccessEnd,
        action,
        actionResult
      );
    } else {
      mdwResult = await this.ExecMdw(
        MiddlewareType.BeforeErrEnd,
        action,
        actionResult
      );
    }
    if (!mdwResult.success) return mdwResult;

    mdwResult = await this.ExecMdw(
      MiddlewareType.BeforeEnd,
      action,
      actionResult
    );
    if (!mdwResult.success) return mdwResult;

    return new MiddlewareResult(true);
  }

  private async ExecMdw(
    type: MiddlewareType,
    action?: Action,
    actionResult?: HttpResult
  ): Promise<MiddlewareResult> {
    for (let i = 0; i < this.middlewares.length; i++) {
      const middleware = this.middlewares[i];
      if (middleware.type != type) continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (middleware as any).requestParams = this.requestParams;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (middleware as any).action = action;
      middleware.actionResult = actionResult;
      const mdwResult = await middleware.do();

      for (const key in mdwResult.additives) {
        this.mdwAdditives[key] = mdwResult.additives[key];
      }

      if (!mdwResult.success) {
        return new MiddlewareResult(false, mdwResult.failedResult);
      }
    }

    return new MiddlewareResult(true);
  }

  private getResultWithAdditives(result: HttpResult) {
    for (const key in this.mdwAdditives) {
      result.headers[key] = this.mdwAdditives[key];
    }
    return result;
  }
}
