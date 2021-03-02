import ApiDocsParam from "./ApiDocsParam";

export default interface ApiDocsParamsBase {
  headers?: ApiDocsParam[];
  body?: ApiDocsParam | ApiDocsParam[];
}
