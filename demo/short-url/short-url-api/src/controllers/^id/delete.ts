import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../lib/Collections";

/**
 * @action delete
 *
 * delete short url
 *
 * @input
 * @@query
 * @@@id {string} short url id
 * @output
 * @@codes
 * @@@204 success
 * @@@403 not open
 */
export default class extends Action {
  async do(): Promise<HttpResult> {
    return this.forbiddenMsg({ message: "not open" });

    // const id = this.requestParams.query.id;
    // if (!id) {
    //   return this.badRequestMsg({ message: "invalid id" });
    // }
    // if (!(await this.isExist(id))) {
    //   return this.notFoundMsg({ message: "the id is not exist" });
    // }

    // await Collections.url.doc(id).delete();
    // return this.noContent();
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
