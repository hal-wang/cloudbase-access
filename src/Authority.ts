import Middleware from "./Middleware";
import MiddlewareType from "./MiddlewareType";

export default abstract class Authority extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeStart);
  }

  /**will be set before doing*/
  public roles: Array<string> = new Array<string>();
}
