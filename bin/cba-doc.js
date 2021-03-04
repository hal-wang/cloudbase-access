#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const DocsCreater = require("../dist/ApiDocs/ApiDocsCreater").default;

const controllers = process.argv[2];
const target = process.argv[3];
const config = process.argv[4];
new DocsCreater(controllers, config).write(target);
