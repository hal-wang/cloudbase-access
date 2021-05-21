import HttpContext from "../src/HttpContext";
import StatusCode from "../src/Response/StatusCode";
import { Action, Response, Request } from "../src/index";

class Login extends Action {
  async invoke(): Promise<void> {
    const { account, password } = <Record<string, unknown>>(
      this.ctx.req.data
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
      new Request(
        {
          body: {
            account: "abc",
            password: "123456",
          },
        },
        {}
      ),
      new Response(StatusCode.ok)
    ),
    0
  );

  await loginAction.invoke();
  expect(loginAction.ctx.response.statusCode).toBe(StatusCode.ok);

  loginAction.ctx.req.data.password = "12345";
  await loginAction.invoke();
  expect(loginAction.ctx.response.statusCode).toBe(StatusCode.badRequest);

  loginAction.ctx.req.data.account = "12";
  await loginAction.invoke();
  expect(loginAction.ctx.response.statusCode).toBe(StatusCode.notFound);
});
