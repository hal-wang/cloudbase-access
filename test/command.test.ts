import * as fs from "fs";
import * as shell from "shelljs";

test("router test", async function () {
  const commandFolder = "./test/command";
  fs.copyFileSync(
    "./cba.config.example.json",
    "./test/command/cba.config.json"
  );

  shell.cd(commandFolder);
  const execResult = shell.exec(`npm run build`);
  console.log("execResult", execResult);

  expect(fs.existsSync("./dist")).toBe(true);
});
