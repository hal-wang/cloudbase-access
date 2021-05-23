import { HttpMethod, Startup, Request } from "../src/index";
import TestConfig from "./TestConfig";

test("method override", async function () {
  const event = {
    httpMethod: "PATCH",
    headers: {
      "X-HTTP-Method-Override": "POST",
    },
  };
  const req = new Request(event, {});
  expect(req.method).toBe(HttpMethod.post);
  expect(req.method).not.toBe(HttpMethod.patch);
});

test("method override upper case", async function () {
  const event = {
    httpMethod: "PATCH",
    headers: {
      "X-HTTP-METHOD-OVERRIDE": "POST",
    },
  };
  const req = new Request(event, {});
  expect(req.method).toBe(HttpMethod.post);
  expect(req.method).not.toBe(HttpMethod.patch);
});

test(`method override request`, async function () {
  const event = {
    path: "/restful",
    httpMethod: "POST",
    headers: {
      "X-HTTP-Method-Override": "GET",
    },
  };
  const startup = new Startup(event, {}).useRouter();
  startup.ctx.setBag("unitTest", { dir: TestConfig.routerDir });

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
  expect((startup.result.body as Record<string, unknown>).method).toBe(
    HttpMethod.get
  );
});
