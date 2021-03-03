import ApiDocsCreater from "../../src/ApiDocs/ApiDocsCreater";

const creater = new ApiDocsCreater(
  "test/controllers",
  "test/docs/doc.config.json"
);

test("api docs creater", async function () {
  const docs = creater.docs;
  expect(!!docs).toBe(true);
});

test("api docs write", async function () {
  creater.write("./test.md");
});
