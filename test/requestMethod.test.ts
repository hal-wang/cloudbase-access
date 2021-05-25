import { Startup } from "../src/index";
import "./UseTest";
import "../src/Router";

test("request method lower case", async function () {
  const startup = new Startup(
    {
      path: "/router",
      httpMethod: "post",
    },
    {}
  )
    .useTest()
    .useRouter();

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
  )
    .useTest()
    .useRouter();

  await startup.invoke();
  expect(startup.result.statusCode).toBe(200);
});
