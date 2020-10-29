import { RequestParams } from "..";
import HttpResult from "./HttpResult";

export default abstract class Action {
  constructor(public readonly roles?: Array<string>) {}

  protected readonly base = HttpResult.base;
  protected readonly ok = HttpResult.ok;
  protected readonly accepted = HttpResult.accepted;
  protected readonly noContent = HttpResult.noContent;
  protected readonly partialContent = HttpResult.partialContent;
  protected readonly badRequest = HttpResult.badRequest;
  protected readonly forbidden = HttpResult.forbidden;
  protected readonly notFound = HttpResult.notFound;
  protected readonly errRequest = HttpResult.errRequest;

  /** will be set before doing */
  requestParams: RequestParams;

  abstract async do(): Promise<HttpResult>;
}
