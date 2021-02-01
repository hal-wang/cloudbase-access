import { HttpResult } from "..";

export default class HttpResultError extends Error {
  constructor(public readonly httpResult: HttpResult, message?: string) {
    super(message);
  }
}
