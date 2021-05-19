import { Response } from "..";

export default class ResponseError extends Error {
  constructor(public readonly response: Response, message?: string) {
    super(message);
  }
}
