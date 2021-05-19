import { HttpMethod, Startup } from "../../src/index";

test(`custom httpMethod test`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "CUSTOM",
  };
  const startup = new Startup(event, {});
  startup.useRouter("test/controllers");
  HttpMethod.custom.push("CUSTOM");
  await startup.do();
  const result = startup.response;
  expect(result.statusCode).toBe(200);
});

test(`custom httpMethod test err`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "CUSTOM",
  };
  const startup = new Startup(event, {});
  startup.useRouter("test/controllers");
  HttpMethod.custom.splice(0);
  await startup.do();
  const result = startup.response;
  expect(result.statusCode).toBe(405);
});
