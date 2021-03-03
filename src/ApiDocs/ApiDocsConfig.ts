import ApiDocsConfigPart from "./ApiDocsBasePart";

export default interface ApiDocsConfig extends ApiDocsConfigPart {
  partConfigs?: ApiDocsConfigPart[] | string[];
  title?: string;
  subtitle?: string;
}
