import Response from ".";

export default class ResponseError extends Error {
  constructor(public readonly res: Response, message?: string) {
    super(message);
  }
}
