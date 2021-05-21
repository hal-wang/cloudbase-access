#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const DocsCreater = require("../dist/ApiDocs/ApiDocsCreater").default;
const Config = require("../dist/Config").default;
const path = require("path");
const config = Config.instance;
if (!config) {
  throw new Error("the config file is not exist");
}

const controllers = path.join(config.target, config.router.controllers);
const target = config.doc.target;
const configPath = config.doc.configPath;
new DocsCreater(controllers, configPath).write(target);
