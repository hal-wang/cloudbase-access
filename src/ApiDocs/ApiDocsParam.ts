export default interface ApiParam {
  type: string;
  name: string;
  desc?: string;
  children?: ApiParam[];
}
