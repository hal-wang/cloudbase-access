import ApiDocsParam from "./ApiDocsParam";
import ApiDocsStateCode from "./ApiDocsStateCode";

export default interface ApiDocsBasePart {
  name?: string;
  inputHeaders?: ApiDocsParam[];
  outputHeaders?: ApiDocsParam[];
  params?: ApiDocsParam[];
  query?: ApiDocsParam[];
  codes?: ApiDocsStateCode[];
}
