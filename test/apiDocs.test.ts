import ApiDocsCreater from "../src/ApiDocs/ApiDocsCreater";
import ApiDocsParam from "../src/ApiDocs/ApiDocsParam";

const creater = new ApiDocsCreater("test/controllers", {
  baseInputHeaders: <ApiDocsParam[]>[
    {
      name: "base-header",
      desc: "this is a base header",
      type: "string",
    },
  ],
});

// test("api docs creater", async function () {
//   const docs = creater.docs;
//   expect(!!docs).toBe(true);
// });

test("api docs write", async function () {
  creater.write("./cba-doc-test.md");
});
