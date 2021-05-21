import { HttpMethod, Startup } from "../../src/index";

test(`restful query test`, async function () {
  let event = {
    body: {},
    path: "/restful/45",
    httpMethod: HttpMethod.get,
  };
  let startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });

  await startup.invoke();
  let result = startup.httpContext.response;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, unknown>).id).toBe("45");

  event = {
    body: {},
    path: "/restful/11/animals",
    httpMethod: HttpMethod.get,
  };
  startup = new Startup(event, {});
  startup.useRouter({ forceControllerFolder: "test/controllers" });

  await startup.invoke();
  result = startup.httpContext.response;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, unknown>).id).toBe("11");
});
