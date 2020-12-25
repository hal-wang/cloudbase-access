import { HttpResult, Router } from "../src/index";

test("router test", async function () {
  const event = <Record<string, unknown>>{
    body: {},
    path: "/actions/router",
  };
  HttpResult.baseHeaders["custom-header"] = "aaa";
  const router = new Router(event, {}, undefined, "test");

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);

  const header = (<Record<string, unknown>>result.headers)["custom-header"];
  expect(header).toBe("aaa");
});
