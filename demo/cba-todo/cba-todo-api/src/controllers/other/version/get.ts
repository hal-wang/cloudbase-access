import { Action, HttpResult } from "@hal-wang/cloudbase-access";

export default class extends Action {
  async do(): Promise<HttpResult> {
    const config = <Record<string, unknown>>require("../../../package.json");

    return this.ok({
      version: config.version,
    });
  }
}
