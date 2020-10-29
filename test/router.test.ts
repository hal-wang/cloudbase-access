import { Router } from "../index";

test("router test", async function () {
  const router = new Router(
    {
      body: {
        account: "abc",
        password: "123456",
      },
      path: "/routerTest/login",
    },
    null,
    "test"
  );

  expect(router.middlewares.length).toBe(0);
  expect((await router.do()).statusCode).toBe(200);
});
