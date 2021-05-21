import { Startup } from "../src/index";

test("request method lower case", async function () {
  const startup = new Startup(
    {
      path: "/router",
      httpMethod: "post",
    },
    {}
  );
  startup.useRouter({ forceControllerFolder: "test/controllers" });

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});

test("request method upper case", async function () {
  const startup = new Startup(
    {
      path: "/router",
      httpMethod: "POST",
    },
    {}
  );
  startup.useRouter({ forceControllerFolder: "test/controllers" });

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});
