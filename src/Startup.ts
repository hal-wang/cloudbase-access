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

  public readonly ctx: HttpContext;
  public get httpResult(): ResponseStruct {
    return this.ctx.res.result;
  }

  constructor(
    event: Record<string, unknown>,
    context: Record<string, unknown>
  ) {
    Startup._current = this;
    this.ctx = new HttpContext(new Request(event, context), new Response(200));
  }

  use(
    mdf:
      | (() => Middleware)
      | ((ctx: HttpContext, next: () => Promise<void>) => Promise<void>)
  ): void {
    if (!mdf) throw new Error();

    let mdFunc;
    if (mdf.length) {
      mdFunc = () => {
        return new SimpleMiddleware(
          mdf as (ctx: HttpContext, next: () => Promise<void>) => Promise<void>
        );
      };
    } else {
      mdFunc = mdf as () => Middleware;
    }

    this.ctx.mds.push({
      mdf: mdFunc,
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
    if (!this.ctx.action) {
      const mapParser = new MapParser(
        this.ctx.req,
        controllerFolder,
        isMethodNecessary
      );
      this.ctx.action = mapParser.action;
    }
    return this.ctx.action;
  }

  async invoke(): Promise<void> {
    try {
      const { mdf, middleware } = this.ctx.mds[0];
      let mdw;
      if (middleware) {
        mdw = middleware;
      } else {
        mdw = mdf();
      }
      mdw.init(this.ctx, 0);
      await mdw.invoke();
    } catch (err) {
      if (err.res) {
        this.ctx.res.update(err.res);
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
