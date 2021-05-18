import { Action, HttpResult } from "..";
import RequestParams from "../Router/RequestParams";
import MiddlewareResult from "./MiddlewareResult";
import MiddlewareType from "./MiddlewareType";

export default abstract class Middleware {
  constructor(public readonly type: MiddlewareType) {}

  //#region will be set before doing
  readonly requestParams!: RequestParams;
  readonly action?: Action;
  //#endregion

  httpResult?: HttpResult;

  abstract do(): Promise<MiddlewareResult>;
}
