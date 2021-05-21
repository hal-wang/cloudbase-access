/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from "fs";
import * as shell from "shelljs";

test("cba command", async function () {
  const sourceConfig = "./cba.config.example.json";
  const targetConfig = "./test/command/cba.config.json";
  fs.copyFileSync(sourceConfig, targetConfig);

  shell.cd("./test/command");

  try {
    const tsconfigPath = "./tsconfig.json";
    const tsconfigStr = fs.readFileSync(tsconfigPath, "utf-8");
    const tsconfig = JSON.parse(tsconfigStr);
    tsconfig.compilerOptions.outDir = "../functions/v1";
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig));

    try {
      {
        const execResult = shell.exec(`npm i && npm run build`);
        expect(execResult.code).toBe(0);
        expect(fs.existsSync(`./dist`)).toBe(true);
        expect(fs.existsSync(`./README.md`)).toBe(false);
      }

      tsconfig.compilerOptions.outDir = "./dist";
      fs.writeFileSync("./tsconfig.json", JSON.stringify(tsconfig));

      {
        const execResult = shell.exec(`npm run build`);
        expect(execResult.code).toBe(0);
        expect(fs.existsSync(tsconfig.compilerOptions.outDir)).toBe(true);
      }
    } finally {
      fs.writeFileSync("./tsconfig.json", tsconfigStr);
    }
  } finally {
    shell.cd("../..");
  }
});
