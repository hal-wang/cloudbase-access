import ApiDocsParam from "./ApiDocsParam";
import ApiDocsParamsBase from "./ApiDocsParamsBase";

export default interface ApiDocsInputParams extends ApiDocsParamsBase {
  query?: ApiDocsParam[];
  params?: ApiDocsParam[];
}
