import { Action, HttpResult } from "..";
import RequestParams from "../Router/RequestParams";
import MiddlewareResult from "./MiddlewareResult";
import MiddlewareType from "./MiddlewareType";

export default abstract class Middleware {
  constructor(public readonly type: MiddlewareType) {}

  //#region will be set before doing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly requestParams: RequestParams = <any>undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly action?: Action = <any>undefined;
  //#endregion

  actionResult?: HttpResult;

  abstract do(): Promise<MiddlewareResult>;
}
