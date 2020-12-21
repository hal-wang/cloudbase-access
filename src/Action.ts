import { Middleware, RequestParams } from ".";
import HttpResult from "./HttpResult";

export default abstract class Action {
  constructor(public readonly roles: Array<string> = new Array<string>()) {}

  protected readonly base = HttpResult.base;
  protected readonly ok = HttpResult.ok;
  protected readonly accepted = HttpResult.accepted;
  protected readonly noContent = HttpResult.noContent;
  protected readonly partialContent = HttpResult.partialContent;
  protected readonly badRequest = HttpResult.badRequest;
  protected readonly forbidden = HttpResult.forbidden;
  protected readonly notFound = HttpResult.notFound;
  protected readonly errRequest = HttpResult.errRequest;
  protected readonly redirect = HttpResult.redirect;

  /** will be set before doing */
  requestParams: RequestParams = RequestParams.empty;
  /** will be set before doing */
  middlewares: Array<Middleware> = new Array<Middleware>();

  abstract do(): Promise<HttpResult>;
}
