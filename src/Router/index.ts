import Authority from "../Authority";
import HttpResult from "../HttpResult";
import Middleware from "../Middleware";
import RequestParams from "../RequestParams";
import StatusCode from "../HttpResult/StatusCode";
import MapParser from "../Map/MapParser";
import Action from "../Action";

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
  constructor(
    event: Record<string, unknown>,
    context: Record<string, unknown>
  ) {
    Router._current = this;
    this.requestParams = new RequestParams(event, context);
  }

  use(middleware: Middleware): void {
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

  private auth?: Authority;
  public useAuth(auth: Authority): void {
    this.use(auth);
    this.auth = auth;
    this.setActionAuth();
  }

  private action?: Action;
  public useRouter(cFolder = "controllers", isMethodNecessary = false): void {
    const mapParser = new MapParser(
      this.requestParams,
      cFolder,
      isMethodNecessary
    );
    this.use(mapParser.action);
    this.action = mapParser.action;
    this.setActionAuth();
  }

  private setActionAuth() {
    if (this.auth && this.action) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.auth as any).roles = ([] as string[]).concat(this.action.roles);
    }
  }

  async do(): Promise<void> {
    try {
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
}
