import ApiDocsConfigPart from "./ApiDocsBasePart";

export default interface ApiDocsConfig extends ApiDocsConfigPart {
  parts?: ApiDocsConfigPart[] | string[];
  partsFromAuth?: boolean;
  title?: string;
  subtitle?: string;
}
