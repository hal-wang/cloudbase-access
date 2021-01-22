import ApiParam from "./ApiParam";

export default interface ApiDocs {
  baseHeaders?: ApiParam[];
  baseParams?: ApiParam[];

  headers?: ApiParam[];
  params?: ApiParam[];
  body?: ApiParam;
}
