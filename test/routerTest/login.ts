import { BaseAction, RequestParams, HttpResult } from "../..";

export default class Login extends BaseAction {
  constructor(requestParams: RequestParams) {
    super(requestParams);
  }

  async do(): Promise<HttpResult> {
    const { account, password } = this.requestParams.data;

    if (account != "abc") return this.notFound("用户不存在");
    if (password != "123456") return this.badRequest("密码错误");

    return this.ok({
      account,
    });
  }
}
