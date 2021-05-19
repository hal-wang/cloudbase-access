import Authority from "./Middleware/Authority";
import Response from "./Response";
import Middleware from "./Middleware";
import Request from "./Request";
import MapParser from "./Map/MapParser";
import HttpContext from "./HttpContext";
import { Action } from ".";

export default class Startup {
  private static _current: Startup;
  public static get current(): Startup {
    return this._current;
  }

  readonly httpContext: HttpContext;

  constructor(
    event: Record<string, unknown>,
    context: Record<string, unknown>
  ) {
    Startup._current = this;
    this.httpContext = new HttpContext(
      new Request(event, context),
      new Response(200)
    );
  }

  use(delegate: () => Middleware): void {
    if (!delegate) throw new Error();
    this.httpContext.middlewares.push({ delegate: delegate });
  }

  /**
   * isMethodNecessary
   *
   * if not, the path end with the httpMethod word will be matched.
   * for example, the post request with path 'user/get' match 'user.ts'.
   *
   * if true, the action in definition must appoint method.
   */
  public useRouter(
    controllerFolder = "controllers",
    authDelegate?: () => Authority,
    isMethodNecessary = false
  ): void {
    const getAction = (): Action => {
      if (!this.httpContext.action) {
        const mapParser = new MapParser(
          this.httpContext.request,
          controllerFolder,
          isMethodNecessary
        );
        this.httpContext.action = mapParser.action;
      }
      return this.httpContext.action;
    };
    getAction.bind(this);

    if (authDelegate) {
      this.use(() => {
        const auth = authDelegate();
        const action = getAction();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (auth.roles as any) = action.roles;
        return auth;
      });
    }
    this.use(() => {
      return getAction();
    });
  }

  async do(): Promise<void> {
    try {
      const { delegate, middleware } = this.httpContext.middlewares[0];
      let mdw;
      if (middleware) {
        mdw = middleware;
      } else {
        mdw = delegate();
      }
      mdw.init(this.httpContext, 0);
      await mdw.do();
    } catch (err) {
      if (err.response) {
        this.httpContext.response.update(err.response);
      } else {
        throw err;
      }
    }
  }
}
