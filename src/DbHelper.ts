import { Database } from "@cloudbase/node-sdk";
import { Request } from ".";

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
   * @param request data: { page, limit }
   * @param partQuery part of query, like where(...)
   */
  static async getPageList(
    request: Request,
    partQuery: Database.Query | Database.CollectionReference
  ): Promise<{ list: unknown[]; total: number | undefined }> {
    const { page, limit } = DbHelper.getPageQuery(request);

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
    request: Request
  ): { page: number; limit: number } {
    let page: number | undefined;
    let limit: number | undefined;

    if (request.params && request.params.page) {
      page = Number(request.params.page);
    } else if (request.data && request.data.page) {
      page = request.data.page as number;
    }

    if (request.params && request.params.limit) {
      limit = Number(request.params.limit);
    } else if (request.params && request.params.pageSize) {
      limit = Number(request.params.pageSize);
    } else if (request.data && request.data.limit) {
      limit = request.data.limit as number;
    } else if (request.data && request.data.pageSize) {
      limit = request.data.pageSize as number;
    }

    if (!page) page = 1;
    if (!limit) limit = 20;

    return {
      page: page,
      limit: limit,
    };
  }
}
