import { HttpMethod, Startup } from "../../src/index";

test(`restful query test`, async function () {
  let event = {
    body: {},
    path: "/restful/45",
    httpMethod: HttpMethod.get,
  };
  let startup = new Startup(event, {});
  startup.useRouter("test/controllers");

  await startup.do();
  let result = startup.response;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, unknown>).id).toBe("45");

  event = {
    body: {},
    path: "/restful/11/animals",
    httpMethod: HttpMethod.get,
  };
  startup = new Startup(event, {});
  startup.useRouter("test/controllers");

  await startup.do();
  result = startup.response;
  expect(result.statusCode).toBe(200);
  expect((result.body as Record<string, unknown>).id).toBe("11");
});
