import ApiDocsParam from "./ApiDocsParam";

export default interface ApiDocsConfig {
  baseInputHeaders?: ApiDocsParam[];
  baseOutputHeaders?: ApiDocsParam[];
  baseParams?: ApiDocsParam[];
}
