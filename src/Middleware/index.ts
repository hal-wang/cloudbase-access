import HttpContext from "../HttpContext";
import Response from "../Response";
import ErrorMessage from "../Response/ErrorMessage";
import StatusCode from "../Response/StatusCode";

export default abstract class Middleware {
  private index!: number;

  private httpContext!: HttpContext;
  public get ctx(): HttpContext {
    return this.httpContext;
  }

  abstract invoke(): Promise<void>;
  protected async next(): Promise<void> {
    if (this.ctx.middlewares.length <= this.index + 1) return;

    const { delegate, middleware } = this.ctx.middlewares[this.index + 1];
    if (middleware) {
      await middleware.invoke();
    } else {
      if (!delegate) return;
      const nextMiddleware = delegate();
      this.ctx.middlewares[this.index].middleware = nextMiddleware;
      nextMiddleware.init(this.ctx, this.index + 1);
      await nextMiddleware.invoke();
    }
  }

  public init(ctx: HttpContext, index: number): void {
    this.httpContext = ctx;
    this.index = index;
  }

  protected res = (
    statusCode: number,
    body?: unknown,
    headers?: Record<string, string>,
    isBase64 = false
  ): Response => this.ctx.res.update({ statusCode, body, headers, isBase64 });

  protected ok = (body?: unknown): Response =>
    this.ctx.res.update({ statusCode: StatusCode.ok, body });

  protected created = (location: string, body?: unknown): Response =>
    this.ctx.res.update({
      statusCode: StatusCode.created,
      body,
      headers: { location },
    });

  protected accepted = (body?: unknown): Response =>
    this.ctx.res.update({ statusCode: StatusCode.accepted, body });

  protected noContent = (): Response =>
    this.ctx.res.update({ statusCode: StatusCode.noContent });

  protected partialContent = (body?: unknown): Response =>
    this.ctx.res.update({
      statusCode: StatusCode.partialContent,
      body,
    });

  protected badRequest = (body?: unknown): Response =>
    this.ctx.res.update({
      statusCode: StatusCode.badRequest,
      body,
    });

  protected badRequestMsg(
    msg?: ErrorMessage & Record<string, unknown>
  ): Response {
    if (!msg) {
      msg = {
        message: "Bad Request",
      };
    }

    return this.badRequest(msg);
  }

  protected unauthorized = (body?: unknown): Response =>
    this.ctx.res.update({
      statusCode: StatusCode.unauthorized,
      body,
    });

  protected unauthorizedMsg(
    msg?: ErrorMessage & Record<string, unknown>
  ): Response {
    if (!msg) {
      msg = {
        message: "Unauthorized",
      };
    }

    return this.unauthorized(msg);
  }

  protected forbidden = (body?: unknown): Response =>
    this.ctx.res.update({
      statusCode: StatusCode.forbidden,
      body,
    });

  protected forbiddenMsg(
    msg?: ErrorMessage & Record<string, unknown>
  ): Response {
    if (!msg) {
      msg = {
        message: "Forbidden",
      };
    }

    return this.forbidden(msg);
  }

  protected notFound = (body?: unknown): Response =>
    this.ctx.res.update({ statusCode: StatusCode.notFound, body });

  protected notFoundMsg(
    msg?: ErrorMessage & Record<string, unknown>
  ): Response {
    if (!msg) {
      msg = {
        message: "Not Found",
      };
    }

    return this.notFound(msg);
  }

  protected errRequest = (body?: unknown): Response =>
    this.ctx.res.update({
      statusCode: StatusCode.errRequest,
      body,
    });

  protected errRequestMsg(
    msg?: ErrorMessage & Record<string, unknown>
  ): Response {
    if (!msg) {
      msg = {
        message: "Error Request",
      };
    }

    return this.errRequest(msg);
  }

  protected redirect = (
    location: string,
    code:
      | StatusCode.redirect301
      | StatusCode.redirect302
      | StatusCode.redirect303
      | StatusCode.redirect307
      | StatusCode.redirect308
      | number = StatusCode.redirect302
  ): Response =>
    this.ctx.res.update({
      statusCode: code,
      headers: { location },
    });
}
