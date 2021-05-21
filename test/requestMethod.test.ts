import { Startup } from "../src/index";

test("request method test", async function () {
  let startup = new Startup(
    {
      path: "/router",
      httpMethod: "post",
    },
    {}
  );
  startup.useRouter({ forceControllerFolder: "test/controllers" });

  await startup.invoke();
  let result = startup.ctx.response;
  expect(result.statusCode).toBe(200);

  startup = new Startup(
    {
      path: "/router",
      httpMethod: "POST",
    },
    {}
  );
  startup.useRouter({ forceControllerFolder: "test/controllers" });

  await startup.invoke();
  result = startup.ctx.response;
  expect(result.statusCode).toBe(200);
});
