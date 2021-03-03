import ApiDocsParam from "./ApiDocsParam";
import ApiDocsStateCode from "./ApiDocsStateCode";

export default interface ApiDocsConfig {
  baseInputHeaders?: ApiDocsParam[];
  baseOutputHeaders?: ApiDocsParam[];
  baseParams?: ApiDocsParam[];
  baseCodes?: ApiDocsStateCode[];
  title?: string;
  subtitle?: string;
}
