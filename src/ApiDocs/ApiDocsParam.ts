export default interface ApiParam {
  name: string;
  type?: string;
  desc?: string;
  children?: ApiParam[];
}
