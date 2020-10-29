import { Action, HttpResult } from "../..";

export default class Router extends Action {
  async do(): Promise<HttpResult> {
    return this.ok("ok");
  }
}
