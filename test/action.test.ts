import { Action, HttpResult, RequestParams } from "../index";

class Login extends Action {
  async do(): Promise<HttpResult> {
    const { account, password } = this.requestParams.data;

    if (account != "abc") return this.notFound("用户不存在");
    if (password != "123456") return this.badRequest("密码错误");

    return this.ok('action ok');
  }
}

test("action test", async function () {
  const loginAction = new Login();
  loginAction.requestParams = new RequestParams({
    body: {
      account: "abc",
      password: "123456",
    },
  });

  let doResult = await loginAction.do();
  expect(doResult.statusCode).toBe(200);

  loginAction.requestParams.data.password = "12345";
  doResult = await loginAction.do();
  expect(doResult.statusCode).toBe(400);

  loginAction.requestParams.data.account = "12";
  doResult = await loginAction.do();
  expect(doResult.statusCode).toBe(404);
});
