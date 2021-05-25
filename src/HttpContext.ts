import Middleware from "./Middleware";
import Request from "./Request";
import Response from "./Response";

export default class HttpContext {
  private readonly bag: { [k: string]: unknown } = {};

  constructor(
    public readonly req: Request,
    public readonly res: Response,
    public readonly mds: {
      mdf: () => Middleware;
      md?: Middleware;
    }[] = []
  ) {}

  public getBag<T>(key: string): T {
    return this.bag[key] as T;
  }
  public setBag<T>(key: string, value: T): HttpContext {
    this.bag[key] = value;
    return this;
  }
}
