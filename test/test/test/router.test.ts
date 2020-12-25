import { Router } from "@hal-wang/cloudbase-access";

test("router test", async function () {
  const event = {
    body: {},
    path: "/actions/RoUtEr",
  };
  const router = new Router(event, {}, undefined, "test");

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
});

test("router not exist", async function () {
  const event = {
    body: {},
    path: "/actions/router1",
  };
  const router = new Router(event, {}, undefined, "test");

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(404);
});

test("shallow router test", async function () {
  const event = {
    body: {},
    path: "/Router",
  };
  const router = new Router(event, {}, undefined, "test");

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
});

test("deep router test", async function () {
  const event = {
    body: {},
    path: "/actions/deepActions/RoUtEr",
  };
  const router = new Router(event, {}, undefined, "test");

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
});

test("create map test", async function () {
  const event = {
    body: {},
    path: "/Router",
  };
  const router = new Router(event, {}, undefined, "test");

  const result = (await router.do()).result;
  expect(result.statusCode).toBe(200);
});
