import { HttpMethod, Startup } from "../../src/index";

test(`action name error`, async function () {
  const event = {
    body: {},
    path: "/err",
    httpMethod: HttpMethod.post,
  };
  const startup = new Startup(event, {});
  startup.ctx.setBag("unitTest", { dir: "test/controllers" });
  startup.useRouter();
  await startup.invoke();
  const result = await startup.invoke();
  expect(result.statusCode).toBe(404);
});
