import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../../../lib/Collections";

export default class extends Action {
  constructor() {
    super(["ql", "todo"]);
  }

  async do(): Promise<HttpResult> {
    const { todoId } = this.requestParams.query;

    const getRes = await Collections.todo.doc(todoId).get();
    return this.ok(getRes.data[0]);
  }
}
