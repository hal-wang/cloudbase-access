import Middleware from "./Middleware";
import Action from "./Middleware/Action";
import Request from "./Request";
import Response from "./Response";

export default class HttpContext {
  public action?: Action;
  public readonly bag: Record<string, unknown> = {};

  constructor(
    public readonly request: Request,
    public readonly response: Response,
    public readonly middlewares: {
      delegate: () => Middleware;
      middleware?: Middleware;
    }[] = []
  ) {}
}
