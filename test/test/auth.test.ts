import {
  Router,
  HttpResult,
  Authority,
  MiddlewareResult,
} from "@hal-wang/cloudbase-access";
import linq = require("linq");

const config = {
  users: [
    {
      account: "abc",
      password: "123456",
    },
    {
      account: "admin",
      password: "abcdef",
    },
  ],
  adminAccount: "admin",
};

test("router test login access", async function () {
  const router = new Router(
    {
      headers: {
        account: config.users[0].account,
        password: config.users[0].password,
      },
      path: "/actions/loginAuth",
    },
    {},
    new Auth(),
    "dist"
  );

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
});

test("router test login not access", async function () {
  const router = new Router(
    {
      headers: {
        account: config.users[0].account,
        password: config.users[0].password + "1",
      },
      path: "/actions/loginAuth",
    },
    {},
    new Auth(),
    "dist"
  );

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(403);
});

test("router test admin access", async function () {
  const router = new Router(
    {
      headers: {
        account: config.users[1].account,
        password: config.users[1].password,
      },
      path: "/actions/adminAuth",
    },
    {},
    new Auth(),
    "dist"
  );

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
});

test("router test admin not access", async function () {
  const router = new Router(
    {
      headers: {
        account: config.users[0].account,
        password: config.users[0].password,
      },
      path: "/actions/adminAuth",
    },
    {},
    new Auth(),
    "dist"
  );

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(403);
});

class Auth extends Authority {
  async do(): Promise<MiddlewareResult> {
    if (!this.roles || !this.roles.length) {
      return MiddlewareResult.getSuccessResult();
    }

    if (
      (this.roles.includes("login") || this.roles.includes("admin")) &&
      !this.loginAuth()
    ) {
      return MiddlewareResult.getFailedResult(
        HttpResult.forbidden("账号或密码错误")
      );
    }

    if (this.roles.includes("admin") && !this.adminAuth()) {
      return MiddlewareResult.getFailedResult(
        HttpResult.forbidden("不是管理员")
      );
    }

    return MiddlewareResult.getSuccessResult();
  }

  adminAuth() {
    const { account } = this.requestParams.headers;
    return account == config.adminAccount;
  }

  loginAuth() {
    const { account, password } = this.requestParams.headers;
    return (
      linq
        .from(config.users)
        .where(
          (u: Record<string, unknown>) =>
            u.account == account && u.password == password
        )
        .count() > 0
    );
  }
}
