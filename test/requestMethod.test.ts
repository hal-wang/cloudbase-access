import { Router } from "../src/index";

test("request method test", async function () {
  let router = new Router(
    {
      path: "/router",
      httpMethod: "post",
    },
    {}
  );
  router.useRouter("test/controllers");

  await router.do();
  let result = router.response;
  expect(result.statusCode).toBe(200);

  router = new Router(
    {
      path: "/router",
      httpMethod: "POST",
    },
    {}
  );
  router.useRouter("test/controllers");

  await router.do();
  result = router.response;
  expect(result.statusCode).toBe(200);
});
