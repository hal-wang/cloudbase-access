import ApiDocsConfigPart from "./ApiDocsBasePart";

export default interface ApiDocsConfig extends ApiDocsConfigPart {
  parts?: ApiDocsConfigPart[] | string[];
  title?: string;
  subtitle?: string;
}
