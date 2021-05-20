#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const DocsCreater = require("../dist/ApiDocs/ApiDocsCreater").default;
const path = require("path");
const config = require(path.join(process.cwd(), "cba.config.json"));

const controllers = path.join(config.target, config.router.controllers);
const target = config.doc.target;
const configPath = config.doc.configPath;
new DocsCreater(controllers, configPath).write(target);
