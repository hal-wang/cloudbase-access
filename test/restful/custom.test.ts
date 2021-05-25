import { HttpMethod, Startup } from "../../src/index";
import "../UseTest";
import "../../src/Router";

test(`custom httpMethod test`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "CUSTOM",
  };
  const startup = new Startup(event, {}).useTest().useRouter();
  HttpMethod.custom.push("CUSTOM");
  const result = await startup.invoke();
  expect(result.statusCode).toBe(200);
});

test(`custom httpMethod test err`, async function () {
  const event = {
    body: {},
    path: "/restful/1",
    httpMethod: "CUSTOM",
  };
  const startup = new Startup(event, {}).useTest().useRouter();
  HttpMethod.custom.splice(0);
  const result = await startup.invoke();
  expect(result.statusCode).toBe(405);
});
