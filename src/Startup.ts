import Authority from "./Middleware/Authority";
import Response from "./Response";
import Middleware from "./Middleware";
import Request from "./Request";
import MapParser from "./Map/MapParser";
import HttpContext from "./HttpContext";
import Action from "./Middleware/Action";
import { ResponseStruct } from ".";
import Config, { RouterConfig } from "./Config";
import SimpleMiddleware from "./Middleware/SimpleMiddleware";

export default class Startup {
  private static _current: Startup;
  public static get current(): Startup {
    return this._current;
  }

  public readonly ctx: HttpContext;
  public get result(): ResponseStruct {
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

  public useRouter(config?: { authFunc?: () => Authority }): void {
    if (config && config.authFunc) {
      const authFunc = config.authFunc;
      this.use(() => {
        const auth = authFunc();
        const action = this.getAction();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (auth.roles as any) = action.roles;
        return auth;
      });
    }
    this.use(() => {
      return this.getAction();
    });
  }

  getAction(): Action {
    if (!this.ctx.action) {
      const mapParser = new MapParser(this.ctx.req, this.dir, this.strict);
      this.ctx.action = mapParser.action;
    }
    return this.ctx.action;
  }

  async invoke(): Promise<ResponseStruct> {
    try {
      const { mdf, md } = this.ctx.mds[0];
      let mdw;
      if (md) {
        mdw = md;
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

    return this.result;
  }

  get unitTest(): RouterConfig {
    return this.ctx.getBag<RouterConfig>("unitTest");
  }

  get dir(): string {
    if (this.unitTest && this.unitTest.dir) {
      return this.unitTest.dir;
    }

    const config = Config.instance;
    if (config && config.router && config.router.dir) {
      return config.router.dir;
    }

    return "controllers";
  }

  /**
   * strict
   *
   * if not, the path end with the httpMethod word will be matched.
   * for example, the post request with path 'user/get' match 'user.ts'.
   *
   * if true, the action in definition must appoint method.
   */
  get strict(): boolean {
    if (this.unitTest && this.unitTest.strict != undefined) {
      return this.unitTest.strict;
    }

    const config = Config.instance;
    if (config && config.router && config.router.strict != undefined) {
      return config.router.strict;
    }

    return false;
  }
}
