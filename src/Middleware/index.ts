import HttpContext from "../HttpContext";
import Response from "../Response";
import ErrorMessage from "../Response/ErrorMessage";
import StatusCode from "../Response/StatusCode";

export default abstract class Middleware {
  private index!: number;

  private _httpContext!: HttpContext;
  public get httpContext(): HttpContext {
    return this._httpContext;
  }

  abstract do(): Promise<void>;
  protected async next(): Promise<void> {
    if (this.httpContext.middlewares.length <= this.index + 1) return;

    const { delegate, middleware } = this.httpContext.middlewares[
      this.index + 1
    ];
    if (middleware) {
      await middleware.do();
    } else {
      if (!delegate) return;
      const nextMiddleware = delegate();
      this.httpContext.middlewares[this.index].middleware = nextMiddleware;
      nextMiddleware.init(this.httpContext, this.index + 1);
      await nextMiddleware.do();
    }
  }

  public init(httpContext: HttpContext, index: number): void {
    this._httpContext = httpContext;
    this.index = index;
  }

  protected response = (
    statusCode: number,
    body?: unknown,
    headers?: Record<string, string>,
    isBase64 = false
  ): Response =>
    this.httpContext.response.update({ statusCode, body, headers, isBase64 });

  protected ok = (body?: unknown): Response =>
    this.httpContext.response.update({ statusCode: StatusCode.ok, body });

  protected created = (location: string, body?: unknown): Response =>
    this.httpContext.response.update({
      statusCode: StatusCode.created,
      body,
      headers: { location },
    });

  protected accepted = (body?: unknown): Response =>
    this.httpContext.response.update({ statusCode: StatusCode.accepted, body });

  protected noContent = (): Response =>
    this.httpContext.response.update({ statusCode: StatusCode.noContent });

  protected partialContent = (body?: unknown): Response =>
    this.httpContext.response.update({
      statusCode: StatusCode.partialContent,
      body,
    });

  protected badRequest = (body?: unknown): Response =>
    this.httpContext.response.update({
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
    this.httpContext.response.update({
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
    this.httpContext.response.update({
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
    this.httpContext.response.update({ statusCode: StatusCode.notFound, body });

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
    this.httpContext.response.update({
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
    this.httpContext.response.update({
      statusCode: code,
      headers: { location },
    });
}
