import { Action, HttpResult, AppInstance } from "@hal-wang/cloudbase-access";

export default class extends Action {
  async do(): Promise<HttpResult> {
    return this.ok({
      envConfig: AppInstance.instance.app.config,
    });
  }
}
