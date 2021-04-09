import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../lib/Collections";
import UrlItem from "../../models/UrlItem";

/**
 * @action long-url
 *
 * get source long url
 *
 * @input
 * @@query
 * @@@id {string} short url id
 * @output
 * @@codes
 * @@@200 success
 * @@body
 * @@@url {string} long url
 */
export default class extends Action {
  async do(): Promise<HttpResult> {
    const id = this.requestParams.query.id;
    if (!id) {
      return this.errMsg(404, "invalid id");
    }
    if (id == "w" || id == "web") {
      return this.redirect("w/");
    }

    const res = await Collections.url.doc(id).get();
    if (!res.data || !res.data.length) {
      return this.errMsg(404, "the id is not exist");
    }

    const url = res.data[0] as UrlItem;
    if (url.expire != undefined && url.expire < new Date().valueOf()) {
      return this.errMsg(403, "the url is overdue");
    }
    if (url.limit != undefined) {
      if (!url.limit) {
        return this.errMsg(403, "the url is out of limit");
      } else {
        await Collections.url.doc(id).update({
          limit: url.limit - 1,
        });
      }
    }

    return this.redirect(url.long, 302);
  }

  errMsg(code: number, msg: string): HttpResult {
    return new HttpResult(code, `alert("${msg}")`, {
      "content-type": "text/html",
    });
  }
}