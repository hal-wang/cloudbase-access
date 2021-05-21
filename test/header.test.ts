import { Response, Startup } from "../src/index";

test("router test", async function () {
  const event = <Record<string, unknown>>{
    body: {},
    path: "/simple/router",
    httpMethod: "POST",
  };
  Response.baseHeaders["custom-header"] = "aaa";
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });

  await startup.invoke();
  const res = startup.ctx.res;
  expect(res.statusCode).toBe(200);

  expect(res.result.headers["custom-header"]).toBe("aaa");
});
