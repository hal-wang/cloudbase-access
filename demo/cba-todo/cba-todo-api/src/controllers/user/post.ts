import { Action, HttpResult } from "@hal-wang/cloudbase-access";
import Collections from "../../lib/Collections";
import Validate from "../../lib/Validate";
import moment = require("moment");
import User from "../../models/User";

/**
 * @action add user
 *
 * signup a account with email
 *
 * @input
 * @@body
 * @@@account {string} email
 * @@@password {string} password
 * @output
 * @@codes
 * @@@200 success
 * @@@400 format error or the account is existing
 * @@body {object} user info
 */
export default class extends Action {
  async do(): Promise<HttpResult> {
    const { account, password } = this.requestParams.data;
    if (typeof account != "string" || !Validate.isEmail(account)) {
      return this.badRequestMsg({ message: "account format error" });
    }

    if (typeof password != "string" || !/\w{6,16}/.test(password)) {
      return this.badRequestMsg({ message: "password format error" });
    }

    const accCountRes = await Collections.user
      .where({
        _id: account,
      })
      .count();
    if (accCountRes.total) {
      return this.badRequestMsg({ message: "the account is existing" });
    }

    const newUser = <User>{
      _id: account,
      password: password,
      create_at: moment().valueOf(),
    };
    await Collections.user.doc(account).set({
      password: password,
      create_at: newUser.create_at,
    });

    return this.ok(newUser);
  }
}
