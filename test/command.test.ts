import * as fs from "fs";
import * as shell from "shelljs";

test("router test", async function () {
  const commandFolder = "./test/command";
  fs.copyFileSync(
    "./cba.config.example.json",
    "./test/command/cba.config.json"
  );

  shell.cd(commandFolder);
  const execResult = shell.exec(`npm i && npm run build`);
  expect(execResult.code).toBe(0);
  expect(fs.existsSync(`./dist`)).toBe(true);
  expect(fs.existsSync(`./README.md`)).toBe(false);
});
