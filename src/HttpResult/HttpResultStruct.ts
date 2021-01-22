export default interface HttpResultStruct {
  isBase64: boolean;
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
}
