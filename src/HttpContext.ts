import Middleware from "./Middleware";
import Action from "./Middleware/Action";
import Request from "./Request";
import Response from "./Response";

export default class HttpContext {
  public action?: Action;
  private readonly bag: { [k: string]: unknown } = {};

  constructor(
    public readonly req: Request,
    public readonly res: Response,
    public readonly mds: {
      delegate: () => Middleware;
      middleware?: Middleware;
    }[] = []
  ) {}

  public getBag<T>(key: string): T {
    return this.bag[key] as T;
  }
  public setBag<T>(key: string, value: T): void {
    this.bag[key] = value;
  }
}
