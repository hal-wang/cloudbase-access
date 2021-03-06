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

  let result = (await router.do()).result;
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

  result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
});
