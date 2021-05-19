import { Action, HttpResult, Middleware, Request } from ".";

export default class HttpContext {
  public action?: Action;

  constructor(
    public readonly request: Request,
    public readonly response: HttpResult,
    public readonly middlewares: {
      delegate: () => Middleware;
      middleware?: Middleware;
    }[] = []
  ) {}
}
