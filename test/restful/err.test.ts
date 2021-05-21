import { HttpMethod, Startup } from "../../src/index";

test(`action name error`, async function () {
  const event = {
    body: {},
    path: "/err",
    httpMethod: HttpMethod.post,
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });
  await startup.invoke();
  const result = startup.ctx.res;
  expect(result.statusCode).toBe(404);
});
