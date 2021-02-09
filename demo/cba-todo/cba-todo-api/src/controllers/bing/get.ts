import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import request = require("request");

export default class extends Action {
  async do(): Promise<HttpResult> {
    return new Promise<HttpResult>((resolve) => {
      request.get(
        `http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN`,
        (error, response, body) => {
          if (error) {
            resolve(
              this.errRequestMsg({
                message: error.message || error || "error",
              })
            );
            return;
          }

          const img = JSON.parse(body).images[0];
          if (!img) {
            resolve(this.notFoundMsg());
            return;
          }

          resolve(this.ok(img));
        }
      );
    });
  }
}
