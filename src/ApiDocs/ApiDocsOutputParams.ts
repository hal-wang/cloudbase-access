import ApiParam from "./ApiParam";

export default interface ApiDocsOutputParams {
  headers?: ApiParam[];
  params?: ApiParam[];
  body?: ApiParam;
}
