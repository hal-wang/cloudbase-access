import * as shell from "shelljs";
import * as fs from "fs";
import Constant from "../src/Constant";

test("js demo", async function () {
  const cbaMapPath = `./${Constant.mapFileName}`;
  shell.cd("./demo/js");
  try {
    if (fs.existsSync(cbaMapPath)) {
      fs.unlinkSync(cbaMapPath);
    }

    const execResult = shell.exec(`npm i && npm run build`);
    expect(execResult.code).toBe(0);
    expect(fs.existsSync(cbaMapPath)).toBeTruthy();
  } finally {
    shell.cd("../..");
  }
});

test("ts demo", async function () {
  const cbaMapPath = `./dist/${Constant.mapFileName}`;
  shell.cd("./demo/ts");
  try {
    if (fs.existsSync(cbaMapPath)) {
      fs.unlinkSync(cbaMapPath);
    }

    const execResult = shell.exec(`npm i && npm run build`);
    expect(execResult.code).toBe(0);
    expect(fs.existsSync(cbaMapPath)).toBeTruthy();
    expect(fs.existsSync("./dist")).toBeTruthy();
    expect(fs.existsSync("./README.md")).toBeFalsy();
  } finally {
    shell.cd("../..");
  }
});
