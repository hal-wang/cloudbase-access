import ApiDocsConfigPart from "./ApiDocsConfigPart";

export default interface ApiDocsConfig {
  parts?: ApiDocsConfigPart[] | string[];
  partsFromAuth?: boolean;
  title?: string;
  subtitle?: string;
}
