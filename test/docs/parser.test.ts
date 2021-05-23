import ApiDocsNoteParser from "../../src/ApiDocs/ApiDocsNoteParser";
import path = require("path");
import TestConfig from "../TestConfig";

test("note parser", async function () {
  const file = path.join(process.cwd(), TestConfig.routerDir, "docs/get.ts");
  const parser = new ApiDocsNoteParser(file);
  parser.docs;
});
