#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const shell = require("shelljs");
const fs = require("fs");
const path = require("path");

const configPath = path.join(process.cwd(), "cba.config.json");
if (!fs.existsSync(configPath)) {
  throw new Error(`cba.config.json is not exist`);
}
const config = require(configPath);

if (config.target && fs.existsSync(path.join(process.cwd(), "tsconfig.json"))) {
  const targetRoot = path.join(process.cwd(), config.target);
  if (fs.existsSync(targetRoot)) {
    deleteFile(targetRoot);
  }

  {
    const execResult = shell.exec("tsc");
    console.log("tsc execResult", execResult);
  }

  {
    const execResult = shell.exec(
      `find ${config.target} -name "*.d.ts" |xargs rm -rf`
    );
    console.log("rm execResult", execResult);
  }

  if (config.static && config.static.length) {
    config.static.forEach(({ source, target }) => {
      const sourcePath = path.join(process.cwd(), source);
      const targetPath = path.join(process.cwd(), config.target, target);
      copyFile(sourcePath, targetPath);
    });
    copyFile(
      path.join(process.cwd(), "package.json"),
      path.join(process.cwd(), config.target, "package.json")
    );
  }
}

const MapCreater = require("../dist/Map/MapCreater").default;
const mapCreater = new MapCreater(
  path.join(config.target, config.router.controllers)
);
if (config.map && config.map.target) {
  mapCreater.write(path.join(config.target, config.map.target));
} else {
  mapCreater.write();
}

function deleteFile(filePath) {
  const stat = fs.statSync(filePath);
  if (stat.isFile()) {
    fs.unlinkSync(filePath);
  } else if (stat.isDirectory()) {
    fs.readdirSync(filePath).forEach((file) => {
      deleteFile(path.join(filePath, file));
    });
    fs.rmdirSync(filePath);
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
      copyFile(path.join(source, file));
    });
  } else if (stat.isFile()) {
    fs.copyFileSync(source, target);
  }
}
