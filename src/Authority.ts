import Middleware from "./Middleware";
import MiddlewareType from "./Middleware/MiddlewareType";

export default abstract class Authority extends Middleware {
  constructor() {
    super(MiddlewareType.BeforeAction);
  }

  //#region will be set before doing
  public readonly roles!: Array<string>;
  //#endregion
}
