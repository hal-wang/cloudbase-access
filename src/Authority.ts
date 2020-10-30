import Middleware, { MiddlewareType } from "./Middleware";

export default abstract class Authority extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeAction);
  }

  /**will be set before doing*/
  public roles?: Array<string>;
}
