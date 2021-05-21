import { Response, Startup } from "../src/index";

test("router test", async function () {
  const event = <Record<string, unknown>>{
    body: {},
    path: "/simple/router",
    httpMethod: "POST",
  };
  Response.baseHeaders["custom-header"] = "aaa";
  const startup = new Startup(event, {});
  startup.ctx.setBag("unitTest", { dir: "test/controllers" });
  startup.useRouter();

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
  expect(startup.result.headers["custom-header"]).toBe("aaa");
});
