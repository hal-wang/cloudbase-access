import { Router } from "../index";

test("router test", async function () {
  const router = new Router(
    {
      body: {},
      path: "/actions/router",
    },
    null,
    "test"
  );

  expect((await router.do()).statusCode).toBe(200);
});
