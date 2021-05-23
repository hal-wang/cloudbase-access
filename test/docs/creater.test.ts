import * as fs from "fs";
import ApiDocsCreater from "../../src/ApiDocs/ApiDocsCreater";
import { AppConfig } from "../../src/Config";
import Constant from "../../src/Constant";
import TestConfig from "../TestConfig";

const configPath = `./demo/${Constant.configFileName}`;
const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as AppConfig;
if (!config || !config.router) {
  throw new Error();
}
config.router.dir = TestConfig.routerDir;

const creater = new ApiDocsCreater(config);
Object.defineProperty(creater, "routerDir", {
  get: function () {
    return TestConfig.routerDir;
  },
});

test("api docs creater", async function () {
  const docs = creater.docs;
  expect(!!docs).toBe(true);
});

test("api docs write", async function () {
  creater.write("./test.md");
});
