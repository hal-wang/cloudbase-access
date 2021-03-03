import ApiDocsParam from "./ApiDocsParam";

export default interface ApiDocsIOParams {
  headers?: ApiDocsParam[];
  body?: ApiDocsParam | ApiDocsParam[];
  desc?: string;
}
