import { Router } from "../src/index";

test("router test", async function () {
  const event = {
    body: {},
    path: "/simple/RoUtEr",
    httpMethod: "POST",
  };
  const router = new Router(event, {}, undefined, "test/controllers");

  await router.do();
  const result = router.response;
  expect(result.statusCode).toBe(200);
});

test("router not exist", async function () {
  const event = {
    body: {},
    path: "/simple/router1",
    httpMethod: "POST",
  };
  const router = new Router(event, {}, undefined, "test/controllers");

  await router.do();
  const result = router.response;
  expect(result.statusCode).toBe(404);
});

test("shallow router test", async function () {
  const event = {
    body: {},
    path: "/router",
    httpMethod: "POST",
  };
  const router = new Router(event, {}, undefined, "test/controllers");

  await router.do();
  const result = router.response;
  expect(result.statusCode).toBe(200);
});

test("deep router test", async function () {
  const event = {
    body: {},
    path: "/simple/deepActions/RoUtEr",
    httpMethod: "POST",
  };
  const router = new Router(event, {}, undefined, "test/controllers");

  await router.do();
  const result = router.response;
  expect(result.statusCode).toBe(200);
});

test("isMethodNecessary test", async function () {
  let event = {
    body: {},
    path: "/simple/Router",
    httpMethod: "POST",
  };

  let router = new Router(event, {}, undefined, "test/controllers");
  router.isMethodNecessary = false;
  await router.do();
  let result = router.response;
  expect(result.statusCode).toBe(200);

  router = new Router(event, {}, undefined, "test/controllers");
  router.isMethodNecessary = true;
  await router.do();
  result = router.response;
  expect(result.statusCode).toBe(404);

  event = {
    body: {},
    path: "/restful",
    httpMethod: "PUT",
  };

  router = new Router(event, {}, undefined, "test/controllers");
  router.isMethodNecessary = false;
  await router.do();
  result = router.response;
  expect(result.statusCode).toBe(200);

  router = new Router(event, {}, undefined, "test/controllers");
  router.isMethodNecessary = true;
  await router.do();
  result = router.response;
  expect(result.statusCode).toBe(200);
});

test("null body test", async function () {
  const event = {
    path: "/nullbody",
    httpMethod: "POST",
  };
  const router = new Router(event, {}, undefined, "test/controllers");

  await router.do();
  const result = router.response;
  expect(result.statusCode).toBe(200);
});
