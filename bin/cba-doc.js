#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const DocsCreater = require("../dist/ApiDocs/ApiDocsCreater").default;

const cfPath = process.argv[2];
const targetFile = process.argv[3];
new DocsCreater(cfPath).write(targetFile);
