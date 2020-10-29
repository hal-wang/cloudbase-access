import Middleware from "./Middleware";

export default abstract class Authority extends Middleware {
  /**will be set before doing*/
  public roles: Array<string>;
}
