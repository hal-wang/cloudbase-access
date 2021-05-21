import { Startup } from "../../src/index";

test(`method not allowed`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "NO",
  };
  const startup = new Startup(event, {});
  startup.ctx.setBag("unitTest", { dir: "test/controllers" });
  startup.useRouter();
  const result = await startup.invoke();
  expect(result.statusCode).toBe(405);
});
