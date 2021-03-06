import { CollectionReference, Query } from "@cloudbase/database";
import { RequestParams } from ".";

export default class DbHelper {
  static getResBadContent(res: Record<string, unknown>): string {
    if (res.code) return `${res.code}, ${res.message}`;
    else return "";
  }

  static async getScalar(
    collection: CollectionReference,
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
    collection: CollectionReference,
    doc: string,
    field: string,
    value: unknown
  ): Promise<number> {
    const fieldObj: Record<string, unknown> = {};
    fieldObj[field] = value;

    const res = await collection.doc(doc).update(fieldObj);
    return res.updated;
  }

  /**
   * @param requestParams data: { page, pageSize }
   * @param partQuery part of query, like where(...)
   */
  static async getPageList(
    requestParams: RequestParams,
    partQuery: Query | CollectionReference
  ): Promise<{ list: unknown[]; total: number }> {
    const { page, pageSize } = DbHelper.getPageQuery(requestParams);

    const countRes = await (typeof partQuery == typeof CollectionReference
      ? (partQuery as CollectionReference)
      : (partQuery as Query)
    ).count();

    const listRes = await (typeof partQuery == typeof CollectionReference
      ? (partQuery as CollectionReference)
      : (partQuery as Query)
    )
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();

    return {
      list: listRes.data,
      total: countRes.total,
    };
  }

  private static getPageQuery(
    requestParams: RequestParams
  ): { page: number; pageSize: number } {
    let page: number | undefined;
    let pageSize: number | undefined;

    if (requestParams.params && requestParams.params.page) {
      page = Number(requestParams.params.page);
    } else if (requestParams.data && requestParams.data.page) {
      page = requestParams.data.page as number;
    }

    if (requestParams.params && requestParams.params.pageSize) {
      pageSize = Number(requestParams.params.pageSize);
    } else if (requestParams.data && requestParams.data.pageSize) {
      pageSize = requestParams.data.pageSize as number;
    }

    if (!page) page = 1;
    if (!pageSize) pageSize = 20;

    return {
      page: page,
      pageSize: pageSize,
    };
  }
}
