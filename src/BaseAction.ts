import HttpResult from "./HttpResult";

export default abstract class BaseAction {
  readonly base: Function;
  readonly ok: Function;
  readonly accepted: Function;
  readonly noContent: Function;
  readonly partialContent: Function;
  readonly badRequest: Function;
  readonly forbidden: Function;
  readonly notFound: Function;
  readonly errRequest: Function;

  constructor(
    public readonly requestParams: Object,
    public readonly roles?: Array<string>
  ) {
    this.base = HttpResult.base;
    this.ok = HttpResult.ok;
    this.accepted = HttpResult.accepted;
    this.noContent = HttpResult.noContent;
    this.partialContent = HttpResult.partialContent;
    this.badRequest = HttpResult.badRequest;
    this.forbidden = HttpResult.forbidden;
    this.notFound = HttpResult.notFound;
    this.errRequest = HttpResult.errRequest;
  }

  abstract async do(): Promise<HttpResult>;
}
