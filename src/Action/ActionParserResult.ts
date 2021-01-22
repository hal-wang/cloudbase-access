import { Action } from "..";

export default interface ActionParserResult {
  action?: Action;
  methodNotAllowed?: boolean;
}
