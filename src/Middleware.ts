import { ErrorMessage, HttpResult } from ".";
import StatusCode from "./HttpResult/StatusCode";
import RequestParams from "./Router/RequestParams";

export default abstract class Middleware {
  //#region will be set before doing
  readonly requestParams!: RequestParams;
  readonly response!: HttpResult;
  private readonly nextMiddleware: Middleware | undefined;
  //#endregion

  abstract do(): Promise<void>;
  protected async next(): Promise<void> {
    if (this.nextMiddleware) {
      await this.nextMiddleware.do();
    }
  }

  protected httpResult = (
    statusCode: number,
    body?: unknown,
    headers?: Record<string, string>,
    isBase64 = false
  ): HttpResult =>
    this.response.update({ statusCode, body, headers, isBase64 });

  protected ok = (body?: unknown): HttpResult =>
    this.response.update({ statusCode: StatusCode.ok, body });

  protected created = (location: string, body?: unknown): HttpResult =>
    this.response.update({
      statusCode: StatusCode.created,
      body,
      headers: { location },
    });

  protected accepted = (body?: unknown): HttpResult =>
    this.response.update({ statusCode: StatusCode.accepted, body });

  protected noContent = (): HttpResult =>
    this.response.update({ statusCode: StatusCode.noContent });

  protected partialContent = (body?: unknown): HttpResult =>
    this.response.update({ statusCode: StatusCode.partialContent, body });

  protected badRequest = (body?: unknown): HttpResult =>
    this.response.update({ statusCode: StatusCode.badRequest, body });

  protected badRequestMsg(
    msg?: ErrorMessage & Record<string, unknown>
  ): HttpResult {
    if (!msg) {
      msg = {
        message: "Bad Request",
      };
    }

    return this.badRequest(msg);
  }

  protected unauthorized = (body?: unknown): HttpResult =>
    this.response.update({ statusCode: StatusCode.unauthorized, body });

  protected unauthorizedMsg(
    msg?: ErrorMessage & Record<string, unknown>
  ): HttpResult {
    if (!msg) {
      msg = {
        message: "Unauthorized",
      };
    }

    return this.unauthorized(msg);
  }

  protected forbidden = (body?: unknown): HttpResult =>
    this.response.update({ statusCode: StatusCode.forbidden, body });

  protected forbiddenMsg(
    msg?: ErrorMessage & Record<string, unknown>
  ): HttpResult {
    if (!msg) {
      msg = {
        message: "Forbidden",
      };
    }

    return this.forbidden(msg);
  }

  protected notFound = (body?: unknown): HttpResult =>
    this.response.update({ statusCode: StatusCode.notFound, body });

  protected notFoundMsg(
    msg?: ErrorMessage & Record<string, unknown>
  ): HttpResult {
    if (!msg) {
      msg = {
        message: "Not Found",
      };
    }

    return this.notFound(msg);
  }

  protected errRequest = (body?: unknown): HttpResult =>
    this.response.update({ statusCode: StatusCode.errRequest, body });

  protected errRequestMsg(
    msg?: ErrorMessage & Record<string, unknown>
  ): HttpResult {
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
  ): HttpResult =>
    this.response.update({ statusCode: code, headers: { location } });
}
