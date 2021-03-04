import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../../lib/Collections";

/**
 * @action todo
 *
 * delete a todo item
 *
 * @input
 * @output
 * @@codes
 * @@@204 success
 */
export default class extends Action {
  constructor() {
    super(["ql", "todo"]);
  }

  async do(): Promise<HttpResult> {
    const { todoId } = this.requestParams.query;

    await Collections.todo.doc(todoId).remove();
    return this.noContent();
  }
}
