import ApiParam from "./ApiParam";
import ApiDocsOutputParams from "./ApiDocsOutputParams";

export default interface ApiDocsInputParams extends ApiDocsOutputParams {
  query?: ApiParam[];
}
