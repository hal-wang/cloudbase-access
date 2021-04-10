import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import { isTest } from "../../Global";

export default class extends Action {
  async do(): Promise<HttpResult> {
    return this.ok({
      env: process.env,
      test: isTest,
      context: this.requestParams.context,
      event: this.requestParams.event,
    });
  }
}
