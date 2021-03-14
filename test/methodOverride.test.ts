import { HttpMethod, Router, RequestParams } from "../src/index";

test("method override", async function () {
  const event = {
    httpMethod: "PATCH",
    headers: {
      "X-HTTP-Method-Override": "POST",
    },
  };
  const rParams = new RequestParams(event, {});
  expect(rParams.method).toBe(HttpMethod.post);
  expect(rParams.method).not.toBe(HttpMethod.patch);
});

test("method override upper case", async function () {
  const event = {
    httpMethod: "PATCH",
    headers: {
      "X-HTTP-METHOD-OVERRIDE": "POST",
    },
  };
  const rParams = new RequestParams(event, {});
  expect(rParams.method).toBe(HttpMethod.post);
  expect(rParams.method).not.toBe(HttpMethod.patch);
});

test(`method override request`, async function () {
  const event = {
    path: "/restful",
    httpMethod: "POST",
    headers: {
      "X-HTTP-Method-Override": "GET",
    },
  };
  const router = new Router(event, {}, undefined, "test/controllers");

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, unknown>).method).toBe(
    HttpMethod.get
  );
});
