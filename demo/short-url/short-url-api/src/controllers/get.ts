import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../lib/Collections";
import * as nanoid from "nanoid";
import Validate from "../lib/Validate";

/**
 * @action short-url
 *
 * create a short url
 *
 * @input
 * @@params
 * @@@url {string} long url
 * @@@expire {number} expire time
 * @output
 * @@codes
 * @@@200 success
 * @@body
 * @@@short-url {string} short url
 * @@@long-url {string} long url
 */
export default class extends Action {
  async do(): Promise<HttpResult> {
    const url = this.requestParams.params.url;
    const custom = this.requestParams.params.custom;
    const expire = Number(this.requestParams.params.expire);
    const limit = Number(this.requestParams.params.limit);
    if (!url || !Validate.isUrl(url)) {
      return this.redirect(`${process.env.shortUrl}/w`, 302);
      // return this.badRequestMsg({ message: "Incorrect url format" });
    }

    const obj = <Record<string, unknown>>{
      long: url,
      create_at: new Date().valueOf(),
    };
    if (!isNaN(expire) && expire > 0) {
      obj.expire = expire;
    }
    if (!isNaN(limit) && limit > 0) {
      obj.limit = limit;
    }

    let id: string;
    if (!!custom) {
      if (custom == "w" || custom == "web") {
        return this.badRequestMsg({ message: "the custom url is exist" });
      }
      if (await this.isExist(custom)) {
        return this.badRequestMsg({ message: "the custom url is exist" });
      } else {
        id = custom;
      }
    } else {
      id = await this.getNewId();
    }
    await Collections.url.doc(id).set(obj);

    return this.ok({
      url: `${process.env.shortUrl}/${id}`,
    });
  }

  async getNewId(length = 4): Promise<string> {
    let times = 0;
    while (true) {
      if (times > 4) {
        return await this.getNewId(length + 1);
      }

      const id = nanoid.nanoid(length);
      if (!(await this.isExist(id))) {
        return id;
      } else {
        times++;
      }
    }
  }

  async isExist(id: string): Promise<boolean> {
    const countRes = await Collections.url
      .where({
        _id: id,
      })
      .count();
    return !!countRes.total;
  }
}
