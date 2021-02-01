import { Router } from "../src/index";

test("router test", async function () {
  const event = {
    body: {},
    path: "/simple/RoUtEr",
    httpMethod: "POST",
  };
  const router = new Router(event, {}, undefined, "test/controllers");

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
});

test("router not exist", async function () {
  const event = {
    body: {},
    path: "/simple/router1",
    httpMethod: "POST",
  };
  const router = new Router(event, {}, undefined, "test/controllers");

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(404);
});

test("shallow router test", async function () {
  const event = {
    body: {},
    path: "/router",
    httpMethod: "POST",
  };
  const router = new Router(event, {}, undefined, "test/controllers");

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
});

test("deep router test", async function () {
  const event = {
    body: {},
    path: "/simple/deepActions/RoUtEr",
    httpMethod: "POST",
  };
  const router = new Router(event, {}, undefined, "test/controllers");

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
});
