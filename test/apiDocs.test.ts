import ApiDocsCreater from "../src/ApiDocs/ApiDocsCreater";
import ApiDocsParam from "../src/ApiDocs/ApiDocsParam";

const creater = new ApiDocsCreater("test/controllers", {
  baseInputHeaders: <ApiDocsParam[]>[
    {
      desc: "this is a desc",
      type: "string",
      name: "name",
    },
  ],
});

test("api docs creater", async function () {
  const docs = creater.docs;
  console.log("docs", docs);
  expect(!!docs).toBe(true);
});

test("api docs write", async function () {
  creater.write("./cba-doc-test.md");
});
