import { Database } from "@cloudbase/node-sdk";
import { RequestParams } from ".";

export default class DbHelper {
  static getResBadContent(res: Record<string, unknown>): string {
    if (res.code) return `${res.code}, ${res.message}`;
    else return "";
  }

  static async getScalar(
    collection: Database.CollectionReference,
    doc: string,
    field: string
  ): Promise<unknown | undefined> {
    const fieldObj: Record<string, unknown> = {};
    fieldObj[field] = true;

    const res = await collection.doc(doc).field(fieldObj).get();
    if (!res.data || !res.data.length) return;
    return res.data[0][field];
  }

  static async updateScalar(
    collection: Database.CollectionReference,
    doc: string,
    field: string,
    value: unknown
  ): Promise<number | undefined> {
    const fieldObj: Record<string, unknown> = {};
    fieldObj[field] = value;

    const res = await collection.doc(doc).update(fieldObj);
    return res.updated;
  }

  /**
   * @param requestParams data: { page, limit }
   * @param partQuery part of query, like where(...)
   */
  static async getPageList(
    requestParams: RequestParams,
    partQuery: Database.Query | Database.CollectionReference
  ): Promise<{ list: unknown[]; total: number | undefined }> {
    const { page, limit } = DbHelper.getPageQuery(requestParams);

    const countRes = await partQuery.count();

    const listRes = await partQuery
      .skip((page - 1) * limit)
      .limit(limit)
      .get();

    return {
      list: listRes.data,
      total: countRes.total,
    };
  }

  private static getPageQuery(
    requestParams: RequestParams
  ): { page: number; limit: number } {
    let page: number | undefined;
    let limit: number | undefined;

    if (requestParams.params && requestParams.params.page) {
      page = Number(requestParams.params.page);
    } else if (requestParams.data && requestParams.data.page) {
      page = requestParams.data.page as number;
    }

    if (requestParams.params && requestParams.params.limit) {
      limit = Number(requestParams.params.limit);
    } else if (requestParams.params && requestParams.params.pageSize) {
      limit = Number(requestParams.params.pageSize);
    } else if (requestParams.data && requestParams.data.limit) {
      limit = requestParams.data.limit as number;
    } else if (requestParams.data && requestParams.data.pageSize) {
      limit = requestParams.data.pageSize as number;
    }

    if (!page) page = 1;
    if (!limit) limit = 20;

    return {
      page: page,
      limit: limit,
    };
  }
}
