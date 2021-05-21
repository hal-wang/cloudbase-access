#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const shell = require("shelljs");
const fs = require("fs");
const path = require("path");
const Config = require("../dist/Config").default;

const tsconfigPath = path.join(process.cwd(), "tsconfig.json");

const config = Config.instance;
if (!config) {
  throw new Error("the config file is not exist");
}

let outDir = "/";
if (fs.existsSync(path.join(process.cwd(), "tsconfig.json"))) {
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
    if (config.static && config.static.length) {
      config.static.forEach(({ source, target }) => {
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

const MapCreater = require("../dist/Map/MapCreater").default;
const mapCreater = new MapCreater(path.join(outDir, config.router.controllers));
if (config.map && config.map.target) {
  mapCreater.write(path.join(outDir, config.map.target));
} else {
  mapCreater.write();
}

function deleteFile(filePath, type = undefined) {
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

function copyFile(source, target) {
  if (!fs.existsSync(source)) return;
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target);
    }
    const files = fs.opendirSync(source);
    files.forEach((file) => {
      copyFile(path.join(source, file), path.join(target, file));
    });
  } else if (stat.isFile()) {
    fs.copyFileSync(source, target);
  }
}
