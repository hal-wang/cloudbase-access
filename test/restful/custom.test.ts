import { HttpMethod, Startup } from "../../src/index";

test(`custom httpMethod test`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "CUSTOM",
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });
  HttpMethod.custom.push("CUSTOM");
  await startup.invoke();
  const result = startup.httpContext.response;
  expect(result.statusCode).toBe(200);
});

test(`custom httpMethod test err`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "CUSTOM",
  };
  const startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });
  HttpMethod.custom.splice(0);
  await startup.invoke();
  const result = startup.httpContext.response;
  expect(result.statusCode).toBe(405);
});
