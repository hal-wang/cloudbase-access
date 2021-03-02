import ApiDocsInputParams from "./ApiDocsInputParams";
import ApiDocsOutputParams from "./ApiDocsOutputParams";

export default interface ApiDocs {
  input?: ApiDocsInputParams;
  output?: ApiDocsOutputParams;
  desc?: string;
}
