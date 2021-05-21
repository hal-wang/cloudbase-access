import { Startup } from "../src/index";
import Authority from "../src/Middleware/Authority";
import linq = require("linq");
import global from "./global";

test("router test login access", async function () {
  const startup = new Startup(
    {
      headers: {
        account: global.users[0].account,
        password: global.users[0].password,
      },
      path: "/simple/loginAuth",
      httpMethod: "POST",
    },
    {}
  );
  startup.useRouter({
    forceControllerFolder: "test/controllers",
    authDelegate: () => new Auth(),
  });

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});

test("router test login not access", async function () {
  const startup = new Startup(
    {
      headers: {
        account: global.users[0].account,
        password: global.users[0].password + "1",
      },
      path: "/simple/loginAuth",
      httpMethod: "POST",
    },
    {}
  );
  startup.useRouter({
    forceControllerFolder: "test/controllers",
    authDelegate: () => new Auth(),
  });

  await startup.invoke();
  expect(startup.result.statusCode).toBe(403);
});

test("router test admin access", async function () {
  const startup = new Startup(
    {
      headers: {
        account: global.users[1].account,
        password: global.users[1].password,
      },
      path: "/simple/adminAuth",
      httpMethod: "POST",
    },
    {}
  );
  startup.useRouter({
    forceControllerFolder: "test/controllers",
    authDelegate: () => new Auth(),
  });

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});

test("router test admin not access", async function () {
  const startup = new Startup(
    {
      headers: {
        account: global.users[0].account,
        password: global.users[0].password,
      },
      path: "/simple/adminAuth",
      httpMethod: "POST",
    },
    {}
  );
  startup.useRouter({
    forceControllerFolder: "test/controllers",
    authDelegate: () => new Auth(),
  });

  await startup.invoke();
  expect(startup.result.statusCode).toBe(403);
});

class Auth extends Authority {
  async invoke(): Promise<void> {
    if (!this.roles || !this.roles.length) {
      await this.next();
      return;
    }

    if (
      (this.roles.includes("login") || this.roles.includes("admin")) &&
      !this.loginAuth()
    ) {
      this.forbidden("账号或密码错误");
      return;
    }

    if (this.roles.includes("admin") && !this.adminAuth()) {
      this.forbidden("不是管理员");
      return;
    }

    await this.next();
  }

  adminAuth() {
    const { account } = this.ctx.req.headers;
    return account == global.adminAccount;
  }

  loginAuth() {
    const { account, password } = this.ctx.req.headers;
    return (
      linq
        .from(global.users)
        .where(
          (u: Record<string, unknown>) =>
            u.account == account && u.password == password
        )
        .count() > 0
    );
  }
}
