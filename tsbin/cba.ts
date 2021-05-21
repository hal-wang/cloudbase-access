#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as shell from "shelljs";
import { Config } from "../dist";
import MapCreater from "../dist/Map/MapCreater";

const config = Config.instance;
if (!config) {
  throw new Error("the config file is not exist");
}

let outDir = "/";
const tsconfigPath = path.join(process.cwd(), "tsconfig.json");
if (fs.existsSync(tsconfigPath)) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const tsconfig = require(tsconfigPath);
  const existDir = tsconfig.compilerOptions && tsconfig.compilerOptions.outDir;
  if (existDir) {
    outDir = tsconfig.compilerOptions.outDir;
  }

  if (existDir) {
    const targetRoot = path.join(process.cwd(), outDir);
    deleteFile(targetRoot);
  }

  const tscResult = shell.exec("tsc");
  if (tscResult.code != 0) {
    throw new Error(tscResult.stderr);
  } else {
    console.log(tscResult.stdout);
  }
  deleteFile(outDir, ".d.ts");

  if (existDir) {
    if (config.ts && config.ts.static) {
      config.ts.static.forEach(({ source, target }) => {
        const sourcePath = path.join(process.cwd(), source);
        const targetPath = path.join(process.cwd(), outDir, target);
        copyFile(sourcePath, targetPath);
      });
    }
    copyFile(
      path.join(process.cwd(), "package.json"),
      path.join(process.cwd(), outDir, "package.json")
    );
    copyFile(
      path.join(process.cwd(), "cba.config.json"),
      path.join(process.cwd(), outDir, "cba.config.json")
    );
  }
}

const mapCreater = new MapCreater(
  path.join(outDir, config.router.dir || "controllers")
);
mapCreater.write();

function deleteFile(filePath: string, type?: string) {
  if (!fs.existsSync(filePath)) return;

  const stat = fs.statSync(filePath);
  if (stat.isFile()) {
    if (!type || filePath.endsWith(type)) {
      fs.unlinkSync(filePath);
    }
  } else if (stat.isDirectory()) {
    fs.readdirSync(filePath).forEach((file) => {
      deleteFile(path.join(filePath, file), type);
    });
    if (!fs.readdirSync(filePath).length) {
      fs.rmdirSync(filePath);
    }
  }
}

function copyFile(source: string, target: string) {
  if (!fs.existsSync(source)) return;
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target);
    }
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      copyFile(path.join(source, file), path.join(target, file));
    });
  } else if (stat.isFile()) {
    fs.copyFileSync(source, target);
  }
}
