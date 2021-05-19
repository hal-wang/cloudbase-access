import StatusCode from "../src/HttpResult/StatusCode";
import { Action, HttpResult, RequestParams } from "../src/index";

class Login extends Action {
  async do(): Promise<void> {
    const { account, password } = <Record<string, unknown>>(
      this.requestParams.data
    );

    if (account != "abc") {
      this.notFound("用户不存在");
      return;
    }
    if (password != "123456") {
      this.badRequest("密码错误");
      return;
    }

    this.ok("action ok");
  }
}

test("action test", async function () {
  const loginAction = new Login();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (loginAction as any).requestParams = new RequestParams(
    {
      body: {
        account: "abc",
        password: "123456",
      },
    },
    {}
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (loginAction as any).response = new HttpResult(StatusCode.ok);

  await loginAction.do();
  expect(loginAction.response.statusCode).toBe(StatusCode.ok);

  loginAction.requestParams.data.password = "12345";
  await loginAction.do();
  expect(loginAction.response.statusCode).toBe(StatusCode.badRequest);

  loginAction.requestParams.data.account = "12";
  await loginAction.do();
  expect(loginAction.response.statusCode).toBe(StatusCode.notFound);
});
