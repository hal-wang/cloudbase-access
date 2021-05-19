import { HttpResult, Router } from "../src/index";

test("router test", async function () {
  const event = <Record<string, unknown>>{
    body: {},
    path: "/simple/router",
    httpMethod: "POST",
  };
  HttpResult.baseHeaders["custom-header"] = "aaa";
  const router = new Router(event, {});
  router.useRouter("test/controllers");

  await router.do();
  const res = router.response;
  expect(res.statusCode).toBe(200);

  expect(res.result.headers["custom-header"]).toBe("aaa");
});
