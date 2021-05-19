import { Router } from "../src/index";

test("request method test", async function () {
  let router = new Router(
    {
      path: "/router",
      httpMethod: "post",
    },
    {},
    undefined,
    "test/controllers"
  );

  await router.do();
  let result = router.response;
  expect(result.statusCode).toBe(200);

  router = new Router(
    {
      path: "/router",
      httpMethod: "POST",
    },
    {},
    undefined,
    "test/controllers"
  );

  await router.do();
  result = router.response;
  expect(result.statusCode).toBe(200);
});
