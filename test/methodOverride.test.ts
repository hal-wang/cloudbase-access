import { HttpMethod, Startup, Request } from "../src/index";

test("method override", async function () {
  const event = {
    httpMethod: "PATCH",
    headers: {
      "X-HTTP-Method-Override": "POST",
    },
  };
  const request = new Request(event, {});
  expect(request.method).toBe(HttpMethod.post);
  expect(request.method).not.toBe(HttpMethod.patch);
});

test("method override upper case", async function () {
  const event = {
    httpMethod: "PATCH",
    headers: {
      "X-HTTP-METHOD-OVERRIDE": "POST",
    },
  };
  const request = new Request(event, {});
  expect(request.method).toBe(HttpMethod.post);
  expect(request.method).not.toBe(HttpMethod.patch);
});

test(`method override request`, async function () {
  const event = {
    path: "/restful",
    httpMethod: "POST",
    headers: {
      "X-HTTP-Method-Override": "GET",
    },
  };
  const startup = new Startup(event, {});
  startup.useRouter("test/controllers");

  await startup.invoke();
  const res = startup.httpContext.response;
  expect(res.statusCode).toBe(200);
  expect((res.body as Record<string, unknown>).method).toBe(HttpMethod.get);
});
