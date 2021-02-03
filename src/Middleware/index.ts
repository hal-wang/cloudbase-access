import { HttpResult } from "..";
import RequestParams from "../Router/RequestParams";
import MiddlewareResult from "./MiddlewareResult";
import MiddlewareType from "./MiddlewareType";

export default abstract class Middleware {
  constructor(public readonly type: MiddlewareType) {}

  /**will be set before doing */
  requestParams: RequestParams = RequestParams.empty;

  actionResult?: HttpResult;

  abstract do(): Promise<MiddlewareResult>;
}
