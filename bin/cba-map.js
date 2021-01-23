#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const linq = require("linq");
const path = require("path");

const cfPath = process.argv[2];
const cFolder = path.join(process.cwd(), cfPath);
if (
  !cfPath ||
  !fs.existsSync(cFolder) ||
  !fs.lstatSync(cFolder).isDirectory()
) {
  throw new Error(
    "please input controllers folder path, for example 'src/controllers'"
  );
}

function readFilesFromFolder(folderRePath, result) {
  const storageItems = linq
    .from(fs.readdirSync(path.join(cFolder, folderRePath)))
    .select((item) => path.join(folderRePath, item));
  storageItems.forEach((storageItem) => {
    const stat = fs.lstatSync(path.join(cFolder, storageItem));
    if (stat.isDirectory()) {
      readFilesFromFolder(storageItem, result);
    } else if (
      stat.isFile() &&
      (storageItem.endsWith(".js") || storageItem.endsWith(".ts"))
    ) {
      result.push(storageItem);
    }
  });
  return result;
}

const result = readFilesFromFolder("", []);
fs.writeFileSync(
  path.join(process.cwd(), "cba-map.json"),
  JSON.stringify(result)
);
