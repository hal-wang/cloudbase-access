import { Action, HttpResult, Middleware, RequestParams } from ".";

export default class HttpContext {
  public action?: Action;

  constructor(
    public readonly request: RequestParams,
    public readonly response: HttpResult,
    public readonly middlewares: {
      delegate: () => Middleware;
      middleware?: Middleware;
    }[] = []
  ) {}
}
