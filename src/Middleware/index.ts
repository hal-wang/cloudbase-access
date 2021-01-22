import RequestParams from "../Router/RequestParams";
import MiddlewareResult from "./MiddlewareResult";
import MiddlewareType from "./MiddlewareType";

export { MiddlewareResult, MiddlewareType };

export default abstract class Middleware {
  constructor(public readonly type: MiddlewareType) {}

  /**will be set before doing */
  requestParams: RequestParams = RequestParams.empty;

  /** if success, return null */
  abstract do(): Promise<MiddlewareResult>;
}
