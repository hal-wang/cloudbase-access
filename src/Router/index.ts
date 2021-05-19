import Authority from "../Authority";
import HttpResult from "../HttpResult";
import Middleware from "../Middleware";
import RequestParams from "./RequestParams";
import MapParser from "../Map/MapParser";
import { Action } from "..";
import StatusCode from "../HttpResult/StatusCode";

export default class Router {
  private static _current: Router;
  public static get current(): Router {
    return this._current;
  }

  readonly requestParams: RequestParams;
  readonly middlewares = <Middleware[]>[];

  readonly response = new HttpResult(StatusCode.ok);

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
    if (auth != null) this.use(auth);
  }

  async use(middleware: Middleware): Promise<void> {
    if (!middleware) throw new Error();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (middleware as any).requestParams = this.requestParams;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (middleware as any).response = this.response;

    if (this.middlewares.length > 0) {
      const preMiddleware = this.middlewares[this.middlewares.length - 1];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (preMiddleware as any).nextMiddleware = middleware;
    }
    this.middlewares.push(middleware);
  }

  async do(): Promise<void> {
    try {
      this.use(this.action);

      const firstMiddleware = this.middlewares[0];
      await firstMiddleware.do();
    } catch (err) {
      if (err.httpResult) {
        this.response.update(err.httpResult);
      } else {
        throw err;
      }
    }
  }

  private get action(): Action {
    const mapParser = new MapParser(
      this.requestParams,
      this.cFolder,
      this.isMethodNecessary
    );
    const action = mapParser.action;
    if (this.auth) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.auth as any).roles = ([] as string[]).concat(action.roles);
    }
    return action;
  }
}
