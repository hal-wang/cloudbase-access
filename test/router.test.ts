import { Router } from "../src/index";

test("router test", async function () {
  const router = new Router(
    {
      body: {},
      path: "/actions/router",
    },
    null,
    "test"
  );

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
});
