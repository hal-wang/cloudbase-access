import Authority from "./Middleware/Authority";
import Response from "./Response";
import Middleware from "./Middleware";
import Request from "./Request";
import MapParser from "./Map/MapParser";
import HttpContext from "./HttpContext";
import Action from "./Middleware/Action";
import { ResponseStruct } from ".";
import Config from "./Config";
import SimpleMiddleware from "./Middleware/SimpleMiddleware";

export default class Startup {
  private static _current: Startup;
  public static get current(): Startup {
    return this._current;
  }

  public readonly httpContext: HttpContext;
  public get httpResult(): ResponseStruct {
    return this.httpContext.response.result;
  }

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

  use(
    delegate:
      | (() => Middleware)
      | ((ctx: HttpContext, next: () => Promise<void>) => Promise<void>)
  ): void {
    if (!delegate) throw new Error();

    let mdDele;
    if (delegate.length) {
      mdDele = () => {
        return new SimpleMiddleware(
          delegate as (
            ctx: HttpContext,
            next: () => Promise<void>
          ) => Promise<void>
        );
      };
    } else {
      mdDele = delegate as () => Middleware;
    }

    this.httpContext.middlewares.push({
      delegate: mdDele,
    });
  }

  /**
   * isMethodNecessary
   *
   * if not, the path end with the httpMethod word will be matched.
   * for example, the post request with path 'user/get' match 'user.ts'.
   *
   * if true, the action in definition must appoint method.
   */
  public useRouter(use?: {
    forceControllerFolder?: string;
    forceIsMethodNecessary?: boolean;
    authDelegate?: () => Authority;
  }): void {
    if (!use) {
      use = {};
    }

    const { controllerFolder, isMethodNecessary } = this.getConfig(
      use.forceControllerFolder,
      use.forceIsMethodNecessary
    );

    if (use.authDelegate) {
      const authDelegate = use.authDelegate;
      this.use(() => {
        const auth = authDelegate();
        const action = this.getAction(controllerFolder, isMethodNecessary);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (auth.roles as any) = action.roles;
        return auth;
      });
    }
    this.use(() => {
      return this.getAction(controllerFolder, isMethodNecessary);
    });
  }

  getAction(controllerFolder: string, isMethodNecessary: boolean): Action {
    if (!this.httpContext.action) {
      const mapParser = new MapParser(
        this.httpContext.request,
        controllerFolder,
        isMethodNecessary
      );
      this.httpContext.action = mapParser.action;
    }
    return this.httpContext.action;
  }

  async invoke(): Promise<void> {
    try {
      const { delegate, middleware } = this.httpContext.middlewares[0];
      let mdw;
      if (middleware) {
        mdw = middleware;
      } else {
        mdw = delegate();
      }
      mdw.init(this.httpContext, 0);
      await mdw.invoke();
    } catch (err) {
      if (err.response) {
        this.httpContext.response.update(err.response);
      } else {
        throw err;
      }
    }
  }

  getConfig(
    forceControllerFolder?: string,
    forceIsMethodNecessary?: boolean
  ): { controllerFolder: string; isMethodNecessary: boolean } {
    const defaultControllers = "controllers";
    const defaultIsMethodNecessary = false;

    let controllerFolder: string | undefined = undefined;
    let isMethodNecessary: boolean | undefined = undefined;
    if (
      // 如果都传值，不用读取 config
      forceControllerFolder != undefined &&
      forceIsMethodNecessary != undefined
    ) {
      controllerFolder = forceControllerFolder;
      isMethodNecessary = forceIsMethodNecessary;
    } else {
      if (forceControllerFolder != undefined) {
        controllerFolder = forceControllerFolder;
      }
      if (forceIsMethodNecessary != undefined) {
        isMethodNecessary = forceIsMethodNecessary;
      }

      const config = Config.instance;
      if (!config || !config.router) {
        if (controllerFolder == undefined) {
          controllerFolder = defaultControllers;
        }
        if (isMethodNecessary == undefined) {
          isMethodNecessary = defaultIsMethodNecessary;
        }
      } else {
        if (controllerFolder == undefined) {
          if (config.router.controllerFolder == undefined) {
            controllerFolder = defaultControllers;
          } else {
            controllerFolder = config.router.controllerFolder;
          }
        }
        if (isMethodNecessary == undefined) {
          if (config.router.isMethodNecessary == undefined) {
            isMethodNecessary = defaultIsMethodNecessary;
          } else {
            isMethodNecessary = config.router.isMethodNecessary;
          }
        }
      }
    }
    return {
      controllerFolder: controllerFolder || defaultControllers,
      isMethodNecessary: isMethodNecessary || defaultIsMethodNecessary,
    };
  }
}
