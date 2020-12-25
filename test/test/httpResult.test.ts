import { HttpResult } from "@hal-wang/cloudbase-access";

test("302 redirect test", async function () {
  const httpResult = HttpResult.redirect("/test").result;
  expect(httpResult.statusCode).toBe(302);
  expect((httpResult.headers as Record<string, unknown>).location).toBe(
    "/test"
  );
});