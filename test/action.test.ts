import HttpContext from "../src/HttpContext";
import StatusCode from "../src/HttpResult/StatusCode";
import { Action, HttpResult, RequestParams } from "../src/index";

class Login extends Action {
  async do(): Promise<void> {
    const { account, password } = <Record<string, unknown>>(
      this.httpContext.request.data
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
  loginAction.init(
    new HttpContext(
      new RequestParams(
        {
          body: {
            account: "abc",
            password: "123456",
          },
        },
        {}
      ),
      new HttpResult(StatusCode.ok)
    ),
    0
  );

  await loginAction.do();
  expect(loginAction.httpContext.response.statusCode).toBe(StatusCode.ok);

  loginAction.httpContext.request.data.password = "12345";
  await loginAction.do();
  expect(loginAction.httpContext.response.statusCode).toBe(
    StatusCode.badRequest
  );

  loginAction.httpContext.request.data.account = "12";
  await loginAction.do();
  expect(loginAction.httpContext.response.statusCode).toBe(StatusCode.notFound);
});
