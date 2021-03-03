import ApiDocsParam from "./ApiDocsParam";
import ApiDocsIOParams from "./ApiDocsIOParams";

export default interface ApiDocsInputParams extends ApiDocsIOParams {
  query?: ApiDocsParam[];
  params?: ApiDocsParam[];
}
