import { HttpResult, Startup } from "../src/index";

test("router test", async function () {
  const event = <Record<string, unknown>>{
    body: {},
    path: "/simple/router",
    httpMethod: "POST",
  };
  HttpResult.baseHeaders["custom-header"] = "aaa";
  const startup = new Startup(event, {});
  startup.useRouter("test/controllers");

  await startup.do();
  const res = startup.httpContext.response;
  expect(res.statusCode).toBe(200);

  expect(res.result.headers["custom-header"]).toBe("aaa");
});
