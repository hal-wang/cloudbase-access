import Middleware from "./Middleware";
import MiddlewareType from "./Middleware/MiddlewareType";

export default abstract class Authority extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeAction);
  }

  /**will be set before doing*/
  public roles: Array<string> = new Array<string>();
}
