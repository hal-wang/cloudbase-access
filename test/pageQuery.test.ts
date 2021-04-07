import { DbHelper, RequestParams } from "../src/index";

test("page query params limit test", async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { page, limit } = (DbHelper as any).getPageQuery(
    new RequestParams(
      {
        queryStringParameters: {
          limit: 2,
          page: 10,
        },
      },
      {}
    )
  );
  expect(limit).toBe(2);
  expect(page).toBe(10);
});

test("page query params pageSize test", async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { page, limit } = (DbHelper as any).getPageQuery(
    new RequestParams(
      {
        queryStringParameters: {
          pageSize: 2,
          page: 10,
        },
      },
      {}
    )
  );
  expect(limit).toBe(2);
  expect(page).toBe(10);
});

test("page query body limit test", async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { page, limit } = (DbHelper as any).getPageQuery(
    new RequestParams(
      {
        body: {
          limit: 2,
          page: 10,
        },
      },
      {}
    )
  );
  expect(limit).toBe(2);
  expect(page).toBe(10);
});

test("page query body pageSize test", async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { page, limit } = (DbHelper as any).getPageQuery(
    new RequestParams(
      {
        body: {
          pageSize: 2,
          page: 10,
        },
      },
      {}
    )
  );
  expect(limit).toBe(2);
  expect(page).toBe(10);
});
