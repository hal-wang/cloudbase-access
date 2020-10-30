import { HttpResult, RequestParams } from ".";

export default abstract class Middleware {
  constructor(public readonly type: MiddlewareType) {}

  /**will be set before doing */
  requestParams?: RequestParams;

  /** if success, return null */
  abstract async do(): Promise<HttpResult>;
}

export const enum MiddlewareType {
  BeforeStart = 1, // the action object is not inited
  BeforeAction, // exec before action doing, the action object is inited
  BeforeEnd, // exec after action doing
  BeforeSuccessEnd, // exec after action doing, if the result is succeeded
  BeforeErrEnd, // exec after action doing, if the result is error
}
