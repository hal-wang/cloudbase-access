import { HttpResult, RequestParams } from "..";

export default abstract class Middleware {
  /**will be set before doing */
  requestParams: RequestParams;

  /** if success, return null */
  abstract async do(): Promise<HttpResult>;
}
