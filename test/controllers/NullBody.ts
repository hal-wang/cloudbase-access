import { Action, HttpResult } from "../../src";

export default class extends Action {
  async do(): Promise<HttpResult> {
    const test = this.requestParams.data.test as string;
    return this.ok({
      test,
    });
  }
}
