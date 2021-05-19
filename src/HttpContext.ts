import { Action, Response, Middleware, Request } from ".";

export default class HttpContext {
  public action?: Action;

  constructor(
    public readonly request: Request,
    public readonly response: Response,
    public readonly middlewares: {
      delegate: () => Middleware;
      middleware?: Middleware;
    }[] = []
  ) {}
}
