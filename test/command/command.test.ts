import * as fs from "fs";
const shell = require("shelljs");

test("router test", async function () {
  const execResult = shell.exec("node ../../bin/cba.js");

  expect(fs.existsSync("./dist")).toBe(true);
});
