export default interface HttpResultStruct {
  isBase64Encoded: boolean;
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
}
