import Response from "./Response";
import Middleware from "./Middleware";
import Request from "./Request";
import HttpContext from "./HttpContext";
import SimpleMiddleware from "./Middleware/SimpleMiddleware";
import ResponseError from "./Response/ResponseError";
import StatusCode from "./Response/StatusCode";
import ResponseStruct from "./Response/ResponseStruct";

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
    this.ctx = new HttpContext(
      new Request(event, context),
      new Response(StatusCode.notFound, <ResponseError>{ message: "Not Found" })
    );
  }

  use(
    mdf:
      | (() => Middleware)
      | ((ctx: HttpContext, next: () => Promise<void>) => Promise<void>)
  ): Startup {
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

    return this;
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
      const error = err as any;
      if (error.res) {
        this.ctx.res.update(error.res);
      } else {
        throw err;
      }
    }

    return this.result;
  }
}
