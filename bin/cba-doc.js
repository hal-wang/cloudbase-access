#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const DocsCreater = require("../dist/ApiDocs/ApiDocsCreater").default;
const Config = require("../dist/Config").default;
const config = Config.instance;
if (!config) {
  throw new Error("the config file is not exist");
}

const target = config.doc.target;
new DocsCreater(config).write(target);
