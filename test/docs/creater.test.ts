import * as fs from "fs";
import ApiDocsCreater from "../../src/ApiDocs/ApiDocsCreater";
import { AppConfig } from "../../src/Config";

const configPath = "./cba.config.example.json";
const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as AppConfig;
if (!config || !config.router) {
  throw new Error();
}
config.router.dir = "test/controllers";

const creater = new ApiDocsCreater(config);
test("api docs creater", async function () {
  const docs = creater.docs;
  expect(!!docs).toBe(true);
});

test("api docs write", async function () {
  creater.write("./test.md");
});
