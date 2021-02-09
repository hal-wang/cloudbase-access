import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../../lib/Collections";
import moment = require("moment");

export default class extends Action {
  constructor() {
    super(["ql", "todo"]);
  }

  async do(): Promise<HttpResult> {
    const { todoId } = this.requestParams.query;
    const { content, schedule } = this.requestParams.data;

    await Collections.todo.doc(todoId).update({
      content: content,
      schedule: schedule,
      update_at: moment().valueOf(),
    });

    const getRes = await Collections.todo.doc(todoId).get();
    return this.ok(getRes.data[0]);
  }
}
