import * as fs from "fs";
import * as shell from "shelljs";

test("router test", async function () {
  const commandFolder = "./test/command";
  const cbaFile = "cba.js";
  const cbaPath = `${commandFolder}/${cbaFile}`;
  fs.copyFileSync("./bin/cba.js", cbaPath);
  fs.copyFileSync(
    "./cba.config.example.json",
    "./test/command/cba.config.json"
  );

  shell.cd(commandFolder);
  const execResult = shell.exec(`node ${cbaFile}`);

  expect(fs.existsSync("./dist")).toBe(true);
});
