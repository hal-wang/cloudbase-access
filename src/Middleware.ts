import { HttpResult } from "..";

export default abstract class Middleware {
  constructor(public readonly requestParams: Object) {}

  /** if success, return null */
  abstract async do(): Promise<HttpResult>;
}
