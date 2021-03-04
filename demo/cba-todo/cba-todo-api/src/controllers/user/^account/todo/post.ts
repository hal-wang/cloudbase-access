import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../../../lib/Collections";
import Todo from "../../../../models/Todo";
import moment = require("moment");

/**
 * @action add todo
 *
 * add a new todo item
 *
 * @input
 * @body
 * @@content {string} todo content
 * @@schedule {number} the todo's schedule with timestamp
 *
 * @output
 * @@codes
 * @@@200 success
 * @body {object} new todo item
 */
export default class extends Action {
  constructor() {
    super(["ql"]);
  }

  async do(): Promise<HttpResult> {
    const { account } = this.requestParams.query;
    const { content, schedule } = this.requestParams.data;

    const newTodo = <Todo>{
      content: content,
      schedule: schedule,
      uid: account,
      create_at: moment().valueOf(),
      update_at: moment().valueOf(),
    };
    const addRes = await Collections.todo.add(newTodo);
    if (!addRes.id) return this.errRequest();
    newTodo._id = addRes.id;

    return this.ok(newTodo);
  }
}
