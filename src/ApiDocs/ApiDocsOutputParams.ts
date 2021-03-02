import ApiDocsParamsBase from "./ApiDocsParamsBase";
import ApiDocsStateCode from "./ApiDocsStateCode";

export default interface ApiDocsOutputParams extends ApiDocsParamsBase {
  codes?: ApiDocsStateCode[];
}
