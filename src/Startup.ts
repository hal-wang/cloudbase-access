import Authority from "./Authority";
import HttpResult from "./HttpResult";
import Middleware from "./Middleware";
import RequestParams from "./RequestParams";
import StatusCode from "./HttpResult/StatusCode";
import MapParser from "./Map/MapParser";

export default class Startup {
  private static _current: Startup;
  public static get current(): Startup {
    return this._current;
  }

  readonly requestParams: RequestParams;
  readonly middlewares = <Middleware[]>[];

  readonly response = new HttpResult(StatusCode.ok);

  constructor(
    event: Record<string, unknown>,
    context: Record<string, unknown>
  ) {
    Startup._current = this;
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
  }

  /**
   * isMethodNecessary
   *
   * if not, the path end with the httpMethod word will be matched.
   * for example, the post request with path 'user/get' match 'user.ts'.
   *
   * if true, the action in definition must appoint method.
   */
  private isMethodNecessary!: boolean;
  private controllerFolder: string | undefined;
  public useRouter(
    controllerFolder = "controllers",
    isMethodNecessary = false
  ): void {
    this.controllerFolder = controllerFolder;
    this.isMethodNecessary = isMethodNecessary;
  }

  private setRouter() {
    if (!this.controllerFolder) return;
    const mapParser = new MapParser(
      this.requestParams,
      this.controllerFolder,
      this.isMethodNecessary
    );
    const action = mapParser.action;
    this.use(action);

    if (this.auth) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.auth as any).roles = ([] as string[]).concat(action.roles);
    }
  }

  async do(): Promise<void> {
    try {
      this.setRouter();
      const firstMiddleware = this.middlewares[0];
      if (firstMiddleware) {
        await firstMiddleware.do();
      }
    } catch (err) {
      if (err.httpResult) {
        this.response.update(err.httpResult);
      } else {
        throw err;
      }
    }
  }
}
